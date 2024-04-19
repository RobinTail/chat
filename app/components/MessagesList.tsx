import List from "@mui/material/List";
import React from "react";
import { UserContext } from "../contexts/UserContext.ts";
import { Message, MessageProps } from "./Message.tsx";

export const MessagesList = ({ messages }: { messages: MessageProps[] }) => {
  const { name } = React.useContext(UserContext);

  const initialMsg: MessageProps = {
    isSystem: true,
    text: `Welcome, ${name}. Type your first message.`,
    author: { name: "System" },
  };

  return (
    <List sx={{ listStyle: "none", p: 0, m: 0, gap: "5px" }}>
      {(messages.length ? messages : [initialMsg]).map((message, index) => (
        <Message key={index} {...message} />
      ))}
    </List>
  );
};
