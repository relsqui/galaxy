import { Button, ButtonGroup, Group, IconButton, Input, NativeSelect, Popover, Portal, Separator, Stack, Text, usePopoverContext } from "@chakra-ui/react"
import { LuCirclePlus } from "react-icons/lu"

import { Exit, ExitRequirements } from "@/lib/pages/home/components/interfaces"
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectCurrentExits, selectCurrentPerson, selectCurrentRoom, selectOwnedRooms } from "@/app/store/slices/currentSelectors";
import { useMoveTo } from "../hooks/useMoveTo";
import { createRoom } from "@/app/store/slices/roomSlice";
import { createExit } from "@/app/store/slices/exitSlice";

export const Exits = () => {
  const authedPerson = useAppSelector(selectCurrentPerson);
  const currentRoom = useAppSelector(selectCurrentRoom);
  const exits = useAppSelector(selectCurrentExits);
  const moveTo = useMoveTo();

  const followExit = async (exit: Exit) => {
    if (exit.origin == authedPerson.location) {
      await moveTo(exit.destination);
    }
  }

  return (
    <ButtonGroup>
      {exits.map((exit) => (
        <Button
          size="sm"
          variant="outline"
          key={exit.id}
          onClick={async () => await followExit(exit)}
        >
          {exit.title}
        </Button>
      ))}
      {
        currentRoom.owner == authedPerson.id ? <NewExitButton /> : ""
      }
    </ButtonGroup>
  )
}

// const EditButton = () => {
//   const authedPerson = useAppSelector(selectCurrentPerson);
//   const currentRoom = useAppSelector(selectCurrentRoom);
// }

const NewExitButton = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton aria-label="New exit" variant="ghost">
          <LuCirclePlus />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <NewExitForm />
            </Popover.Body>
            <Popover.CloseTrigger />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}

const NewExitForm = () => {
  const currentRoom = useAppSelector(selectCurrentRoom);
  const ownedRooms = useAppSelector(selectOwnedRooms);
  const dispatch = useAppDispatch();
  const popover = usePopoverContext();

  const normalizeExitForm = (formData: FormData): ExitRequirements => {
    return {
      origin: currentRoom.id,
      destination: parseInt(formData.get("destination") as string) || 0,
      title: formData.get("exitName") as string || "?",
    }
  }

  const handleNewExitToOldRoom = async (formData: FormData) => {
    await dispatch(createExit(normalizeExitForm(formData)));
    popover.setOpen(false);
  }

  const handleNewExitToNewRoom = async (formData: FormData) => {
    const newRoom = await dispatch(createRoom()).unwrap();
    await dispatch(createExit({ ...normalizeExitForm(formData), destination: newRoom.id }));
    popover.setOpen(false);
  }

  return (
    <form>
      <Stack>
        <Input name="exitName" placeholder="New exit name" />
        <Separator />
        <Group>
          <NativeSelect.Root>
            <NativeSelect.Field name="destination" placeholder="Destination">
              {ownedRooms.map((room) => (
                <option value={room.id} key={room.id}>(#{room.id}) {room.title}</option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
          <Button type="submit" formAction={handleNewExitToOldRoom}>Link</Button>
        </Group>
        <Text alignSelf="center">or</Text>
        <Button type="submit" formAction={handleNewExitToNewRoom}>Link to New Room</Button>
      </Stack>
    </form>
  )
}
