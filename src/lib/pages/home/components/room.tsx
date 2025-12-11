import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Button,
  ButtonGroup,
  Editable,
  For,
  Heading,
  Stack,
} from "@chakra-ui/react";

import { Person, Room, Exit } from "./interfaces";
import { profileDrawer } from "./profileDrawer";
import { useAuthedPerson } from "../hooks/useAuthedPerson";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export const RoomContents = () => {
  const [authedPerson, updateAuthedPerson] = useAuthedPerson();
  const [room, setRoom] = useState<Room | null>();
  const [exits, setExits] = useState<Array<Exit>>([]);
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    getHere();
  }, [authedPerson?.location]);

  const getHere = async () => {
    if (!authedPerson) return;
    const room = (
      await supabase
        .from("room")
        .select()
        .eq("id", authedPerson.location)
        .single()
    ).data;
    if (!room) return;
    setRoom(room);
    const exits = (await supabase.from("exit").select().eq("origin", room.id))
      .data;
    if (exits) {
      setExits(exits);
    }
    const people = (
      await supabase.from("person").select().eq("location", room.id)
    ).data;
    if (people) {
      setPeople(people);
    }
  };

  const followExit = async (exitId: number) => {
    if (!authedPerson) return null;
    const matchingExits: Exit[] = exits.filter(
      (e) => e.id == exitId && authedPerson.location == e.origin
    );
    if (matchingExits.length != 1) return null;
    const exit = matchingExits[0];
    const location = exit.destination;
    await updateAuthedPerson({ location });
  };

  const updateDescription = async (newDescription: string) => {
    if (!(authedPerson && room && authedPerson.id == room.owner)) return null;
    await supabase
      .from("room")
      .update({ description: newDescription })
      .eq("id", room.id);
    await getHere();
  };

  const title = room?.title || "In Between";
  const description = room?.description || "A fleeting liminal space.";

  return (
    <Stack>
      <Heading>{title}</Heading>
      <Editable.Root
        disabled={authedPerson?.id != room?.owner}
        value={description}
        onValueChange={(e) => updateDescription(e.value)}
      >
        <Editable.Preview />
        <Editable.Textarea />
      </Editable.Root>
      <ButtonGroup>
        {exits.map((exit) => (
          <Button
            size="sm"
            variant="outline"
            key={exit.id}
            onClick={async () => await followExit(exit.id)}
          >
            {exit.title}
          </Button>
        ))}
      </ButtonGroup>
      <Stack direction="row">
        <For each={people}>
          {(person) => (
            <Button
              size="xs"
              variant="surface"
              key={person.id}
              onClick={async () =>
                await profileDrawer.open("profileDrawer", {
                  authedPerson,
                  updateAuthedPerson,
                  person,
                })
              }
            >
              {person.display_name}
            </Button>
          )}
        </For>
        <profileDrawer.Viewport />
      </Stack>
    </Stack>
  );
};
