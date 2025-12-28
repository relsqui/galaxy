import { useAppSelector } from "@/app/hooks";
import { RoomContents } from "./components/room";
import { selectIsAuthed } from "@/app/store/slices/currentSelectors";

const Home = async () => {
  const isAuthed = useAppSelector(selectIsAuthed);
  return isAuthed ? <RoomContents /> : "";
}

export default Home;
