import { useAppDispatch } from "@/app/hooks";
import { fetchExits } from "@/app/store/slices/exitSlice";
import { updatePerson, fetchPeople } from "@/app/store/slices/personSlice";

export const useMoveTo = () => {
  const dispatch = useAppDispatch();
  return async (destination: number) => {
    await dispatch(updatePerson({
      location: destination
    }));
    await dispatch(fetchPeople());
    await dispatch(fetchExits());
  }
}