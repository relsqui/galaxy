import { Button, ButtonGroup, Checkbox, CloseButton, Field, Flex, Group, IconButton, Input, InputGroup, NativeSelect, Popover, Portal, Separator, Stack, Text, usePopoverContext } from "@chakra-ui/react"
import { LuCirclePlus, LuLock, LuLockOpen, LuPencil, LuPencilOff } from "react-icons/lu"

import { Exit, ExitRequirements } from "@/lib/pages/home/components/interfaces"
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectCurrentExits, selectCurrentPerson, selectCurrentRoom, selectOwnedRooms } from "@/app/store/slices/currentSelectors";
import { useMoveTo } from "../hooks/useMoveTo";
import { createRoom } from "@/app/store/slices/roomSlice";
import { createExit, deleteExit, updateExit } from "@/app/store/slices/exitSlice";
import { useState } from "react";

export const Exits = ({ canEdit }: { canEdit: boolean }) => {
  const authedPerson = useAppSelector(selectCurrentPerson);
  const exits = useAppSelector(selectCurrentExits);
  const [editing, setEditing] = useState(false);
  const moveTo = useMoveTo();

  const followExit = async (exit: Exit) => {
    // TODO move this check inside moveTo if it's not also there already
    if (exit.origin == authedPerson.location) {
      await moveTo(exit.destination);
    }
  }

  const toggleEditing = () => {
    setEditing(!editing);
  }

  return (
    <Flex wrap="wrap" asChild>
      <ButtonGroup>
        {exits.map((exit) => editing ? (
          <EditableExit exit={exit} />
        ) : (
          <Button
            size="sm"
            variant="outline"
            key={exit.id}
            onClick={async () => await followExit(exit)}
            disabled={exit.locked && !canEdit}
          >
            {exit.locked ? canEdit ? <LuLockOpen /> : <LuLock /> : ""}
            {exit.title}
          </Button>
        ))
        }
        {canEdit ? <EditButton {...{ editing, toggleEditing }} /> : ""}
      </ButtonGroup >
    </Flex>
  );
}

const EditableExit = ({ exit }: { exit: Exit }) => {
  const [exitTitle, setExitTitle] = useState(exit.title);
  const dispatch = useAppDispatch();

  const deleteThisExit = async () => {
    await dispatch(deleteExit(exit));
  }

  const commitTitle = async () => {
    await dispatch(updateExit({ id: exit.id, title: exitTitle }))
  }

  return (
    <InputGroup endElement={<CloseButton size="sm" variant="ghost" onClick={deleteThisExit} />}>
      <Input
        value={exitTitle}
        onChange={(e) => setExitTitle(e.target.value)}
        onBlur={commitTitle}
      />
    </InputGroup>
  );

}

const EditButton = ({ editing, toggleEditing }: { editing: boolean, toggleEditing: () => void }) => {
  const authedPerson = useAppSelector(selectCurrentPerson);
  const currentRoom = useAppSelector(selectCurrentRoom);
  return currentRoom.owner != authedPerson.id ? "" : (
    <ButtonGroup>
      {editing ? <NewExitButton /> : ""}
      <IconButton aria-label="Edit exits" variant="ghost" size="xs" onClick={toggleEditing}>
        {editing ? <LuPencilOff /> : <LuPencil />}
      </IconButton>
    </ButtonGroup>
  )
}

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
      locked: formData.get("locked") == "on" ? true : false,
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
        <Input name="exitName" placeholder="New exit name" autoComplete="off" />
        <Field.Root>
          <Checkbox.Root name="locked">
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>
              Locked
            </Checkbox.Label>
          </Checkbox.Root>
          <Field.HelperText>
            Only you can use your locked exits.
          </Field.HelperText>
        </Field.Root>
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
