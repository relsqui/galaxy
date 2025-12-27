// import { RealtimeChannel } from "@supabase/supabase-js";
// import { useState, useEffect } from "react";
// import { broadcastPayload } from "../components/interfaces";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
// );
// await supabase.realtime.setAuth() // Needed for Realtime Authorization

// const useBroadcast = () => {
//   const [locChannel, setLocChannel] = useState<RealtimeChannel | null>();

//   useEffect(() => {
//     if (!authedPerson) return;
//     const locTopic = `location:${authedPerson.location}`;
//     if (locChannel) {
//       if (locChannel.subTopic == locTopic) return;
//       supabase.removeChannel(locChannel);
//     }
//     setLocChannel(getBroadcastChannel(locTopic));
//   });

//   const getBroadcastChannel = (topic: string) => {
//     return supabase
//       .channel(topic, {
//         config: { private: true },
//       })
//       // .on('broadcast', { event: 'INSERT' }, handleBroadcast)
//       // .on('broadcast', { event: 'UPDATE' }, handleBroadcast)
//       // .on('broadcast', { event: 'DELETE' }, handleBroadcast)
//       .subscribe()
//   }

//   const handleBroadcast = async (broadcast: any) => {
//     const { op, table, old_record: oldRecord, record: newRecord }: broadcastPayload = broadcast.payload
//     switch (table) {
//       case "person": {

//       }
//     }
//   }
// }
