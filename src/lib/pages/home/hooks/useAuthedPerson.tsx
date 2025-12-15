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

  const updateAuthedPerson = async (personUpdates?: Partial<Person>) => {
    // try to use the authedPerson we already have
    let updatedPerson = authedPerson;
    // otherwise go get one
    if (!updatedPerson) {
      const authId = (await supabase.auth.getUser())?.data?.user?.id;
      if (!authId) return;
      const userId = (await supabase.from("auth_user").select("id").eq("auth_id", authId).single()).data?.id;
      if (!userId) return;
      updatedPerson = (
        await supabase
          .from("person")
          .select()
          .eq("id", userId)
          .single()
      ).data;
    }
    if (updatedPerson && personUpdates) {
      updatedPerson = (
        await supabase
          .from("person")
          .update(personUpdates)
          .eq("id", updatedPerson.id)
          .select()
          .single()
      ).data;
    }
    setAuthedPerson(updatedPerson);
  };

  return [authedPerson, updateAuthedPerson];
};
