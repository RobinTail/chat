import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import React from "react";
import { UserContext } from "../contexts/UserContext.ts";

export const MessagesList = ({ messages }: { messages: never[] }) => {
  const { name } = React.useContext(UserContext);

  return (
    <List sx={{ listStyle: "none", p: 0, m: 0 }}>
      {messages.length ? (
        messages.map((message, index) => (
          <ListItem key={index}>
            [Message key message] [Embed key isMy data=embed ]
          </ListItem>
        ))
      ) : (
        <ListItem>
          [Message key isSystem text: "Welcome, name. Type your first message."
          author.name=system]
        </ListItem>
      )}
    </List>
  );
};
