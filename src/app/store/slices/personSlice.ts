import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit"
import { createClient } from "@supabase/supabase-js";
import { RootState } from ".."
import { Person } from "@/lib/pages/home/components/interfaces";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const personAdapter = createEntityAdapter<Person>();
const initialState = personAdapter.getInitialState(undefined, [
  {
    id: 0,
    location: 0,
    created_at: new Date(),
    display_name: "",
    description: ""
  }
]);

export const fetchPeople = createAsyncThunk("person/fetchPeople", async () => {
  const personData = (await supabase.from("person").select()).data;
  return personData ? personData.reduce((personEntities, person) => {
    return { ...personEntities, [person.id]: person }
  }, {}) : {};
})

export const updatePerson = createAsyncThunk<
  Person,
  Partial<Person>,
  { state: RootState }
>(
  "person/updatePerson",
  async (updates: Partial<Person>, { getState }) => {
    const state = getState();
    const personData = (
      await supabase
        .from("person")
        .update(updates)
        .eq("id", updates.id || state.authedID.value)
        .select()
        .single()
    ).data;
    return personData;
  }
)

export const personSlice = createSlice({
  name: "person",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPeople.fulfilled, personAdapter.setAll)
      .addCase(updatePerson.fulfilled, personAdapter.upsertOne)
  }
})

export default personSlice.reducer;

export const { selectAll: selectPeople, selectById: selectPersonById } =
  personAdapter.getSelectors((state: RootState) => state.person);

