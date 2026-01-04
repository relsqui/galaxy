import { useAppSelector } from "@/app/hooks";
import { selectPersonById } from "@/app/store/slices/personSlice";
import { selectRooms } from "@/app/store/slices/roomSlice";
import { GalaxyMessage } from "@/lib/components/broadcast/galaxyMessage";
import { DBOperation } from "@/lib/components/broadcast/interfaces";
import { Box } from "@chakra-ui/react";
import { Room } from "./interfaces";

const usePredicate = (operation: DBOperation, changes: any) => {
  if (operation == DBOperation.INSERT) return "appears";
  if (operation == DBOperation.DELETE) return "disappears";

  const rooms = useAppSelector(state => selectRooms(state)).reduce((roomMap, room) => {
    roomMap[room.id] = room;
    return roomMap;
  }, {} as { [key: number]: Room });

  const predicates = [];
  if (changes.location) {
    predicates.push(`moves from ${rooms[changes.location[0]].title} to ${rooms[changes.location[1]].title}`);
  }
  if (changes.display_name) {
    predicates.push(`changes their name (previously ${changes.display_name[0]})`);
  }

  // TODO: commaAnd(string[]): string
  return predicates.length ? predicates.join(", ") + "." : null;
}

export const PersonMessage = ({ message }: { message: GalaxyMessage }) => {
  const person = useAppSelector(state => selectPersonById(state, message.record.id));
  // ... I will probably wind up inlining this, it's not actually very general
  const predicate = usePredicate(message.operation, message.changes);

  return predicate ? (
    <Box>
      {person.display_name} {predicate}
    </Box>
  ) : "";
}

export const MessageMessage = ({ message }: { message: GalaxyMessage }) => {
  // we'll deal with the others later
  if (message.operation != DBOperation.INSERT) return "";

  const person = useAppSelector(state => selectPersonById(state, message.record.owner));
  const { type, content } = message.record;
  let predicate = `sends a '${type}' message: ${JSON.stringify(content)}`
  switch (type) {
    case "say":
      predicate = `says, "${content.payload}"`
  }

  return (
    <Box>
      {person.display_name} {predicate}
    </Box>
  )
}