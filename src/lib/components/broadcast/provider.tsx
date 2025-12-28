import { createClient } from "@supabase/supabase-js";
import { useState, useEffect, createContext, PropsWithChildren, useContext, useCallback, useMemo } from "react";
import { BroadcastContextType, BroadcastListener, BroadcastPayload, initBroadcastListeners, SubscribeFn, UnsubscribeFn } from "./interfaces";
import { useAppSelector } from "@/app/hooks";
import { selectCurrentPerson } from "@/app/store/slices/currentSelectors";
import { galaxyMessage } from "./galaxyMessage";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);
await supabase.realtime.setAuth() // Needed for Realtime Authorization

const BroadcastContext = createContext<BroadcastContextType>(
  [
    () => ({ table: "message", handler: () => { }, priority: 0 }),
    () => { }
  ]
)

export const BroadcastProvider = (props: PropsWithChildren) => {
  const authedPerson = useAppSelector(selectCurrentPerson);
  const [listeners, setListeners] = useState(initBroadcastListeners);

  useEffect(() => {
    if (!authedPerson) return;
    const locTopic = `location:${authedPerson.location}`;
    const locChannel = getBroadcastChannel(locTopic);
    return () => {
      supabase.removeChannel(locChannel);
    };
  }, [authedPerson?.location]);

  const getBroadcastChannel = (topic: string) => {
    return supabase
      .channel(topic, {
        config: { private: true },
      })
      .on('broadcast', { event: 'INSERT' }, distributeBroadcast)
      .on('broadcast', { event: 'UPDATE' }, distributeBroadcast)
      .on('broadcast', { event: 'DELETE' }, distributeBroadcast)
      .subscribe()
  }

  const distributeBroadcast = ({ payload }: { payload: BroadcastPayload }) => {
    for (const listener of listeners[payload.table]) {
      if (listener.handler(galaxyMessage(payload))) {
        break;
      }
    }
  }

  const subscribe: SubscribeFn = useCallback((table, handler, priority = 0) => {
    const listener = { table, handler, priority };
    setListeners(prevListeners => {
      return {
        ...prevListeners,
        [listener.table]: [...prevListeners[listener.table], listener]
      };
    });
    return listener;
  }, []);

  const unsubscribe: UnsubscribeFn = useCallback((listener: BroadcastListener) => {
    setListeners(prevListeners => ({
      ...prevListeners,
      [listener.table]: prevListeners[listener.table].filter(l => l != listener)
    }))
  }, [])

  const contextValue = useMemo<BroadcastContextType>(() => [subscribe, unsubscribe], [subscribe, unsubscribe]);

  return <BroadcastContext.Provider value={contextValue}>
    {props.children}
  </BroadcastContext.Provider>
}

export const useSubscribe = () => useContext(BroadcastContext);
