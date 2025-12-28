import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export const fetchAuthedID = createAsyncThunk("authedID/fetchAuthedID", async () => {
  const authedUser = (await supabase.auth.getUser()).data.user;
  if (!authedUser) return 0;
  const authedPerson = (await supabase
    .from("auth_user")
    .select()
    .eq("auth_id", authedUser.id)
    .single()).data;
  if (!authedPerson) return 0;
  return parseInt(authedPerson.id);
})

export const authedIDSlice = createSlice({
  name: "authedID",
  initialState: { loading: "idle", value: 0 },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAuthedID.pending, (state) => {
        state.loading = "pending"
      })
      .addCase(fetchAuthedID.rejected, (state) => {
        state.loading = "failed"
      })
      .addCase(fetchAuthedID.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = "succeeded"
        state.value = action.payload
      })
  }
})

export default authedIDSlice.reducer;
