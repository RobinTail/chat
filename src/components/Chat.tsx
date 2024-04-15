import Box from "@mui/material/Box";
import React from "react";
import smoothScroll from "smoothscroll";
import "ion-sound";
import io from "socket.io-client";
import { UserContext } from "../contexts/UserContext.ts";
import { MessageProps } from "./Message.tsx";
import { MessageComposer } from "./MessageComposer.tsx";
import { MessagesList } from "./MessagesList.tsx";

export const Chat = () => {
  const [messages, setMessages] = React.useState<MessageProps[]>([]);
  const [isTyping, setTyping] = React.useState(false);
  const { sounds } = React.useContext(UserContext);
  const socket = React.useMemo(
    () => io("http://localhost:8090/", { withCredentials: true }),
    [],
  );

  React.useEffect(() => {
    socket.on("connect", () => {
      setMessages((current) =>
        current.concat({
          author: { name: "System" },
          isSystem: true,
          text: "Connected",
          at: new Date(),
        }),
      );
    });
    socket.on("connect_error", () => {
      setMessages((current) =>
        current.concat({
          author: { name: "System" },
          isSystem: true,
          severity: "critical",
          text: "Connection lost",
          at: new Date(),
        }),
      );
    });
  }, [socket]);

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
