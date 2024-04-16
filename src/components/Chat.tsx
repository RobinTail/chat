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

const socket = io("http://localhost:8090/", {
  withCredentials: true,
  autoConnect: false, // avoiding effect dependency
}) as Root.Socket;

export const Chat = () => {
  const [isConnected, setConnected] = useState(false);
  const [messages, setMessages] = React.useState<MessageProps[]>([]);
  const [isTyping, setTyping] = React.useState(false);
  const { sounds } = React.useContext(UserContext);

  React.useEffect(() => {
    socket.connect();
    socket.on("connect", () => setConnected(true));
    socket.on("connect_error", () => setConnected(false));
    socket.on("enter_chat", (data) => {
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
    socket.on("new_messages", (incoming) => {
      setMessages((current) => current.concat(incoming));
    });
    /** strict mode runs this effect twice, cleanup required */
    return () => {
      socket.disconnect();
      socket.removeAllListeners("connect");
      socket.removeAllListeners("connect_error");
      socket.removeAllListeners("enter_chat");
      socket.removeAllListeners("new_messages");
    };
  }, []);

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
        onSend={(text) => {
          socket.emit("submit", text);
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
