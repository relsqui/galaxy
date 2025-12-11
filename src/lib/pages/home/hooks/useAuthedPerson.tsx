import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Person } from "../components/interfaces";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export const useAuthedPerson = (): [
  Person | null,
  (newPerson?: Partial<Person>) => Promise<void>,
] => {
  const [authedPerson, setAuthedPerson] = useState<Person | null>(null);

  useEffect(() => {
    updateAuthedPerson();
  }, []);

  const updateAuthedPerson = async (newPerson?: Partial<Person>) => {
    const id = (await supabase.from("auth_user").select("id").single()).data;
    if (!id) return;
    let updatedPerson = (
      await supabase.from("person").select().eq("id", id.id).single()
    ).data;
    if (authedPerson && newPerson) {
      updatedPerson = (
        await supabase
          .from("person")
          .update(newPerson)
          .eq("id", authedPerson.id)
          .select()
          .single()
      ).data;
    }
    setAuthedPerson(updatedPerson);
  };

  return [authedPerson, updateAuthedPerson];
};
