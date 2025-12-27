import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit"
import { createClient } from "@supabase/supabase-js";
import { RootState } from ".."
import { AtLeastID, Room } from "@/lib/pages/home/components/interfaces";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const roomAdapter = createEntityAdapter<Room>();
const initialState = roomAdapter.getInitialState(undefined, [
  {
    id: 0,
    owner: 0,
    title: "In Between",
    description: "A fleeting liminal space."
  }
]);

export const fetchRooms = createAsyncThunk("room/fetchRooms", async () => {
  const roomData = (await supabase.from("room").select()).data;
  return roomData ? roomData.reduce((roomEntities, room) => {
    return { ...roomEntities, [room.id]: room }
  }, {}) : {};
});

export const createRoom = createAsyncThunk<
  Room,
  undefined,
  { state: RootState }
>(
  "room/createRoom",
  async (_, { getState }) => {
    const state = getState();
    return (
      await supabase
        .from("room")
        .insert({ owner: state.authedID.value })
        .select()
        .single()
    ).data;
  }
);

export const updateRoom = createAsyncThunk("room/updateRoom", async (updates: AtLeastID<Room>) => {
  return (await supabase.from("room").update(updates).eq("id", updates.id).select().single()).data;
})

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchRooms.fulfilled, roomAdapter.setAll)
      .addCase(createRoom.fulfilled, roomAdapter.addOne)
      .addCase(updateRoom.fulfilled, roomAdapter.upsertOne)
  }
});

export default roomSlice.reducer;

export const { selectAll: selectRooms, selectById: selectRoomById } =
  roomAdapter.getSelectors((state: RootState) => state.room);
