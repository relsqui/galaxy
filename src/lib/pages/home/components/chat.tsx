import { useSubscribe } from "@/lib/components/broadcast/provider"
import { Box, Input } from "@chakra-ui/react"
import { JSX, useEffect, useState } from "react";
import { PersonMessage, MessageMessage } from "./chatMessage";
import { useAppDispatch } from "@/app/hooks";
import { createMessage } from "@/app/store/slices/messageSlice";
import { BroadcastListener } from "@/lib/components/broadcast/interfaces";

export const Chat = () => {
  const [messageComponents, setMessageComponents] = useState<JSX.Element[]>([]);
  const [subscribe, unsubscribe] = useSubscribe();

  const addMessageComponent = (message: JSX.Element) => {
    setMessageComponents(prevMessages => [...prevMessages, message].slice(-10))
  }

  useEffect(() => {
    const listeners: BroadcastListener[] = [];
    listeners.push(subscribe("message", (message) => {
      addMessageComponent(<MessageMessage key={message.id} message={message} />);
    }));
    listeners.push(subscribe("person", (message) => {
      addMessageComponent(<PersonMessage key={message.id} message={message} />);
    }));
    return () => { listeners.forEach(unsubscribe); };
  }, [])

  return (
    <>
      <Box>
        {...messageComponents}
      </Box>
      <ChatInput />
    </>
  )
}

export const ChatInput = () => {
  const dispatch = useAppDispatch();

  const sendMessage = async (text: string | null) => {
    if (!text) return;
    await dispatch(createMessage({
      type: "say",
      content: { payload: text.trim() }
    }))
  }

  return (
    <form action={(e) => sendMessage(e.get("chatInput") as string | null)}>
      <Input name="chatInput" autoComplete="off" />
    </form >
  )
}
