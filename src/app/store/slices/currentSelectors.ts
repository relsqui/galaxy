import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectPeople, selectPersonById } from "./personSlice";
import { selectRoomById, selectRooms } from "./roomSlice";
import { selectExits } from "./exitSlice";

export const selectIsAuthed = (state: RootState) => state.authedID.loading == "succeeded" && !!state.authedID.value;

export const selectCurrentPerson =
  (state: RootState) => selectPersonById(state, state.authedID.value);

const selectCurrentLocation = (state: RootState) => selectCurrentPerson(state).location;

export const selectCurrentRoom =
  (state: RootState) => selectRoomById(state, selectCurrentLocation(state));

export const selectCurrentNeighbors = createSelector(
  selectPeople,
  selectCurrentLocation,
  (people, currentLocation) => people.filter(person => person.location == currentLocation)
);

export const selectCurrentExits = createSelector(
  selectExits,
  selectCurrentLocation,
  (exits, currentLocation) => exits.filter(exit => exit.origin == currentLocation)
);

export const selectOwnedRooms = createSelector(
  selectRooms,
  selectCurrentPerson,
  (rooms, currentPerson) => rooms.filter(room => room.owner == currentPerson.id)
)

export const canEditThisRoom = createSelector(
  selectCurrentPerson,
  selectCurrentRoom,
  (currentPerson, currentRoom) => currentRoom.owner == currentPerson.id
)
