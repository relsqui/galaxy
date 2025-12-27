import { Editable, Heading, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectCurrentPerson, selectCurrentRoom } from "@/app/store/slices/currentSelectors";
import { updateRoom } from "@/app/store/slices/roomSlice";

import { People, profileDrawer } from "@/lib/pages/home/components/people";
import { Exits } from "@/lib/pages/home/components/exits";


// this can't be Room because that's the interface
export const RoomContents = () => {
  const authedPerson = useAppSelector(selectCurrentPerson);
  const room = useAppSelector(selectCurrentRoom);
  const [roomTitle, setRoomTitle] = useState(room.title);
  const [roomDescription, setRoomDescription] = useState(room.description);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setRoomTitle(room.title);
    setRoomDescription(room.description);
  }, [room.id])

  const dispatchUpdateRoom = async () => {
    await dispatch(updateRoom({
      id: room.id,
      title: roomTitle.trim(),
      description: roomDescription.trim()
    }))
  }

  return (
    <>
      <Stack>
        <Heading asChild>
          <Editable.Root
            disabled={authedPerson.id != room?.owner}
            value={roomTitle}
            onValueChange={e => setRoomTitle(e.value)}
            onValueCommit={dispatchUpdateRoom}
          >
            <Editable.Preview />
            <Editable.Input />
          </Editable.Root>
        </Heading>
        <Editable.Root
          disabled={authedPerson.id != room?.owner}
          value={roomDescription}
          onValueChange={e => setRoomDescription(e.value)}
          onValueCommit={dispatchUpdateRoom}
        >
          <Editable.Preview />
          <Editable.Textarea />
        </Editable.Root>
        <Exits />
        <People />
      </Stack>
      <profileDrawer.Viewport />
    </>
  );
};
