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
    // if we don't have one, go get one
    if (!authedPerson) {
      // a user can only view their own auth_user row
      const idRow = (await supabase.from("auth_user").select("id").single()).data;
      if (!idRow) return;
      updatedPerson = (
        await supabase
          .from("person")
          .select()
          .eq("id", idRow.id)
          .single()
      ).data;
    }
    // now that we know who we are we can change
    if (updatedPerson && personUpdates) {
      console.log(personUpdates)
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
