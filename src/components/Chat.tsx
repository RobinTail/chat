import Box from "@mui/material/Box";
import React from "react";
import smoothscroll from "smoothscroll";
import "ion-sound";
import { UserContext } from "../contexts/UserContext.ts";

export const Chat = () => {
  const [messages, setMessages] = React.useState([]);
  const [isTyping, setTyping] = React.useState(false);
  const { sounds } = React.useContext(UserContext);

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
    smoothscroll(document.body.scrollHeight);
  }, [messages, sounds]);

  return (
    <Box
      sx={{
        pb: "100px",
        mt: { xs: "43px", md: "unset" },
      }}
    >
      [MessagesList messages] [MessageComposer isTyping]
    </Box>
  );
};
