import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { selectPeople, selectPersonById } from "./personSlice";
import { selectRoomById } from "./roomSlice";
import { selectExits } from "./exitSlice";

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
