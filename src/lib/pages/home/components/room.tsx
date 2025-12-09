import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export const Room = () => {
  const [room, setRoom] = useState<object>({});

  useEffect(() => {
    getRoom();
  }, []);

  async function getRoom() {
    const room = await supabase.from("room").select();
    setRoom(room);
  }
  return <pre>{JSON.stringify(room, null, 2)}</pre>;
};
