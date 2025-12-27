import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit"
import { createClient } from "@supabase/supabase-js";
import { RootState } from ".."
import { AtLeastID, Exit, ExitRequirements } from "@/lib/pages/home/components/interfaces";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const exitAdapter = createEntityAdapter<Exit>();
const initialState = exitAdapter.getInitialState();

export const fetchExits = createAsyncThunk("exit/fetchExits", async () => {
  const exitData = (await supabase.from("exit").select()).data;
  return exitData ? exitData.reduce((exitEntities, exit) => {
    return { ...exitEntities, [exit.id]: exit }
  }, {}) : {};
});

export const createExit = createAsyncThunk(
  "exit/createExit",
  async (newExit: ExitRequirements) => {
    return (await supabase.from("exit").insert(newExit).select().single()).data;
  }
);

export const updateExit = createAsyncThunk("exit/updateExit", async (exit: AtLeastID<Exit>) => {
  return (
    await supabase.from("exit").update(exit).eq("id", exit.id).select().single()
  ).data;
})

export const deleteExit = createAsyncThunk("exit/deleteExit", async (exit: AtLeastID<Exit>) => {
  await supabase.from("exit").delete().eq("id", exit.id);
  return exit.id;
})

export const exitSlice = createSlice({
  name: 'exit',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchExits.fulfilled, exitAdapter.setAll)
      .addCase(createExit.fulfilled, exitAdapter.addOne)
      .addCase(updateExit.fulfilled, exitAdapter.upsertOne)
      .addCase(deleteExit.fulfilled, exitAdapter.removeOne)
  }
});

export default exitSlice.reducer;

export const { selectAll: selectExits, selectById: selectExitById } =
  exitAdapter.getSelectors((state: RootState) => state.exit);
