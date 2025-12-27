import { Button, ButtonGroup, Group, IconButton, Input, NativeSelect, Popover, Portal, Stack } from "@chakra-ui/react"
import { LuCirclePlus } from "react-icons/lu"
import { Exit } from "@/lib/pages/home/components/interfaces"
import { createClient } from "@supabase/supabase-js";
import { useAppSelector } from "@/app/hooks";
import { selectCurrentExits, selectCurrentPerson, selectCurrentRoom, selectOwnedRooms } from "@/app/store/slices/currentSelectors";
import { useMoveTo } from "../hooks/useMoveTo";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export const Exits = () => {
  const exits = useAppSelector(selectCurrentExits);
  const currentPerson = useAppSelector(selectCurrentPerson);
  const moveTo = useMoveTo();

  const followExit = async (exit: Exit) => {
    if (exit.origin == currentPerson.location) {
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
      <NewExitButton />
    </ButtonGroup>
  )
}

const NewExitButton = () => {
  const authedPerson = useAppSelector(selectCurrentPerson);
  const currentRoom = useAppSelector(selectCurrentRoom);
  const ownedRooms = useAppSelector(selectOwnedRooms);

  const addExitTo = async (destination: number, name: string) => {
    if (!authedPerson) return;
    console.log(authedPerson.location)
    await supabase.from("exit").insert({ origin: authedPerson.location, destination, title: name });
  }

  const handleNewExitToOldRoom = async (formData: FormData) => {
    await addExitTo(
      parseInt(formData.get("destination") as string),
      formData.get("exitName") as string
    )
  }

  const handleNewExitToNewRoom = async (formData: FormData) => {
    if (!authedPerson) return;
    const { data: newRoom, error } =
      await supabase.from("room").insert({ owner: authedPerson.id }).select();
    if (error) {
      console.log(error);
    } else {
      await addExitTo(newRoom[0].id, formData.get("exitName") as string)
    }
  }

  return currentRoom.owner == authedPerson.id ? (
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
              <form>
                <Stack>
                  <Input name="exitName" placeholder="New exit name" />
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
                  <Button type="submit" formAction={handleNewExitToNewRoom}>Link to New Room</Button>
                </Stack>
              </form>
            </Popover.Body>
            <Popover.CloseTrigger />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  ) : ""
}
