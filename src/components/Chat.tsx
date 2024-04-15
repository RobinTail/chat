import Box from "@mui/material/Box";
import React, { useState } from "react";
import smoothScroll from "smoothscroll";
import "ion-sound";
import io from "socket.io-client";
import { UserContext } from "../contexts/UserContext.ts";
import { MessageProps } from "./Message.tsx";
import { MessageComposer } from "./MessageComposer.tsx";
import { MessagesList } from "./MessagesList.tsx";
import { Root } from "../client.ts";

export const Chat = () => {
  const [isConnected, setConnected] = useState(false);
  const [messages, setMessages] = React.useState<MessageProps[]>([]);
  const [isTyping, setTyping] = React.useState(false);
  const { sounds } = React.useContext(UserContext);
  const socket = React.useMemo(
    () =>
      io("http://localhost:8090/", { withCredentials: true }) as Root.Socket,
    [],
  );

  React.useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("connect_error", () => setConnected(false));
    socket.on("enter_chat", (data) => {
      // @todo duplicates
      setMessages((current) =>
        current.concat({
          author: { name: "System" },
          isSystem: true,
          severity: "warning",
          text: data.name + " (" + data.provider + ") enters chat.",
          at: new Date(),
        }),
      );
    });
  }, [socket]);

  React.useEffect(() => {
    setMessages((current) =>
      current.concat({
        author: { name: "System" },
        isSystem: true,
        severity: isConnected ? undefined : "critical",
        text: isConnected ? "Connected" : "Connection lost",
        at: new Date(),
      }),
    );
  }, [isConnected]);

  React.useEffect(() => {
    window.ion.sound({
      sounds: [{ name: "notice" }],
      path: "/sounds/",
      preload: true,
      multiplay: true,
      volume: 0.4,
    });
  }, []);

  React.useEffect(() => {
    if (sounds) {
      window.ion.sound.play("notice");
    }
    smoothScroll(document.body.scrollHeight);
  }, [messages, sounds]);

  return (
    <Box
      sx={{
        pb: "100px",
        mt: { xs: "43px", md: "unset" },
      }}
    >
      <MessagesList messages={messages} />
      <MessageComposer
        setTyping={setTyping}
        onSend={() => {
          /* @todo */
        }}
        others={
          [
            /* @todo */
          ]
        }
      />
    </Box>
  );
};
