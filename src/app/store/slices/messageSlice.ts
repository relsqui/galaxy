import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit"
import { createClient } from "@supabase/supabase-js";
import { RootState } from ".."
import { AtLeastID, Message, MessageRequirements } from "@/lib/pages/home/components/interfaces";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const messageAdapter = createEntityAdapter<Message>();
const initialState = messageAdapter.getInitialState();

export const createMessage = createAsyncThunk<
  Message,
  MessageRequirements,
  { state: RootState }
>(
  "message/createMessage",
  async (newMessage, { getState }) => {
    const state = getState();
    const owner = state.authedID.value;
    const location = state.person.entities[owner].location;
    return (
      await supabase
        .from("message")
        .insert({ ...newMessage, owner, location })
        .select()
        .single()
    ).data;
  }
);

export const updateMessage = createAsyncThunk("message/updateMessage", async (message: AtLeastID<Message>) => {
  return (
    await supabase.from("message").update(message).eq("id", message.id).select().single()
  ).data;
})

export const deleteMessage = createAsyncThunk("message/deleteMessage", async (message: AtLeastID<Message>) => {
  await supabase.from("message").delete().eq("id", message.id);
  return message.id;
})

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createMessage.fulfilled, messageAdapter.addOne)
      .addCase(updateMessage.fulfilled, messageAdapter.upsertOne)
      .addCase(deleteMessage.fulfilled, messageAdapter.removeOne)
  }
});

export default messageSlice.reducer;

export const { selectAll: selectMessages, selectById: selectMessageById } =
  messageAdapter.getSelectors((state: RootState) => state.message);
