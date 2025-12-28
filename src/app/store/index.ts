import { configureStore } from "@reduxjs/toolkit"
import authedIDReducer from "./slices/authedIDSlice"
import personReducer from "./slices/personSlice"
import roomReducer from "./slices/roomSlice"
import exitReducer from "./slices/exitSlice"
import messageReducer from "./slices/messageSlice"

export const store = configureStore({
  reducer: {
    authedID: authedIDReducer,
    person: personReducer,
    room: roomReducer,
    exit: exitReducer,
    message: messageReducer,
  }
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
