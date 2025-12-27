import { useState, useEffect } from "react";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { Editable, Heading, Stack } from "@chakra-ui/react";

// import { dbOperation, broadcastPayload } from "@/lib/pages/home/components/interfaces";

import { useAppSelector } from "@/app/hooks";
import { selectCurrentPerson, selectCurrentRoom } from "@/app/store/slices/currentSelectors";

import { People, profileDrawer } from "@/lib/pages/home/components/people";
import { Exits } from "@/lib/pages/home/components/exits";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
await supabase.realtime.setAuth() // Needed for Realtime Authorization


export const RoomContents = () => {
  const authedPerson = useAppSelector(selectCurrentPerson);
  const room = useAppSelector(selectCurrentRoom);
  const [locChannel, setLocChannel] = useState<RealtimeChannel | null>();

  useEffect(() => {
    if (!authedPerson) return;
    const locTopic = `location:${authedPerson.location}`;
    if (locChannel) {
      if (locChannel.subTopic == locTopic) return;
      supabase.removeChannel(locChannel);
    }
    setLocChannel(getBroadcastChannel(locTopic));
  });

  const getBroadcastChannel = (topic: string) => {
    return supabase
      .channel(topic, {
        config: { private: true },
      })
      // .on('broadcast', { event: 'INSERT' }, handleBroadcast)
      // .on('broadcast', { event: 'UPDATE' }, handleBroadcast)
      // .on('broadcast', { event: 'DELETE' }, handleBroadcast)
      .subscribe()
  }

  // const handleBroadcast = async (broadcast: any) => {
  //   const { op, table, old_record: oldRecord, record: newRecord }: broadcastPayload = broadcast.payload
  //   switch (table) {
  //     case "person": {

  //     }
  //   }
  // }

  const updateTitle = async (newTitle: string) => {
    if (!(authedPerson && room && authedPerson.id == room.owner)) return null;
    await supabase
      .from("room")
      .update({ title: newTitle })
      .eq("id", room.id);
  }

  const updateDescription = async (newDescription: string) => {
    if (!(authedPerson && room && authedPerson.id == room.owner)) return null;
    await supabase
      .from("room")
      .update({ description: newDescription })
      .eq("id", room.id);
  };

  return (
    <>
      <Stack>
        <Heading asChild>
          <Editable.Root
            disabled={authedPerson.id != room?.owner}
            value={room.title}
            onValueChange={(e) => updateTitle(e.value)}
          >
            <Editable.Preview />
            <Editable.Input />

          </Editable.Root>
        </Heading>
        <Editable.Root
          disabled={authedPerson.id != room?.owner}
          value={room.description}
          onValueChange={(e) => updateDescription(e.value)}
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
