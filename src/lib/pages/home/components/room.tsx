import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Badge,
  Button,
  ButtonGroup,
  For,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

interface Person {
  id: number;
  location: number;
  display_name: string;
}

interface Room {
  id: number;
  title: string;
  description: string;
}

interface Exit {
  id: number;
  title: string;
  description: string;
  origin: number;
  destination: number;
}

export const Room = () => {
  const [person, setPerson] = useState<Person | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [exits, setExits] = useState<Array<Exit>>([]);
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    getPerson();
  }, []);

  useEffect(() => {
    getHere();
  }, [person?.location]);

  async function getPerson() {
    const id = (await supabase.from("auth_user").select("id").limit(1).single())
      .data;
    if (!id) return;
    const person = (
      await supabase.from("person").select().eq("id", id.id).limit(1).single()
    ).data;
    if (!person) return;
    setPerson(person);
  }

  async function getHere() {
    if (!person) return;
    const room = (
      await supabase
        .from("room")
        .select()
        .eq("id", person.location)
        .limit(1)
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
  }

  async function followExit(exitId: number) {
    if (!person) return null;
    const matchingExits: Exit[] = exits.filter(
      (e) => e.id == exitId && person.location == e.origin
    );
    if (matchingExits.length != 1) return null;
    const exit = matchingExits[0];
    await supabase
      .from("person")
      .update({ location: exit.destination })
      .eq("id", person.id);
    await getPerson();
  }

  const title = room?.title || "...";
  const description = room?.description || "...";

  return (
    <Stack>
      <Heading>{title}</Heading>
      <Text>{description}</Text>
      <Stack direction="row">
        <For each={people}>
          {(person) => (
            <Badge size="md" variant="outline" key={person.id}>
              {person.display_name}
            </Badge>
          )}
        </For>
      </Stack>
      <ButtonGroup>
        {exits.map((exit) => (
          <Button
            size="sm"
            key={exit.id}
            onClick={async () => await followExit(exit.id)}
          >
            {exit.title}
          </Button>
        ))}
      </ButtonGroup>
    </Stack>
  );
};
