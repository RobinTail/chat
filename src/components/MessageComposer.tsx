import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import React from "react";
import { MessageProps } from "./Message.tsx";
import {
  wrapperDefault,
  wrapperMD,
  wrapperSM,
  wrapperXS,
  wrapperXSPadding,
} from "../vars.tsx";
import msgSend from "../assets/msg-send.svg";

const TYPING_TIMEOUT = 800;

export const MessageComposer = ({
  setTyping,
  onSend,
  others,
}: {
  setTyping: (next: boolean) => void;
  onSend: (msg: string) => void;
  others: MessageProps["author"][];
}) => {
  const [message, setMessage] = React.useState("");
  const timer = React.useRef<NodeJS.Timeout>();

  const send = React.useCallback(() => {
    if (message.trim().length > 0) {
      onSend(message);
      setMessage("");
    }
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        textAlign: "center",
        zIndex: 3,
        backgroundColor: "#eee",
        boxShadow: "#eee 0 0 20px 10px",
      }}
    >
      {others.length ? (
        <Box
          sx={{
            position: "relative",
            display: "inline-block",
            top: "5px",
            zIndex: 100,
            fontStyle: "italic",
            color: "rgba(0, 0, 0, 0.4)",
            fontSize: "13px",
            lineHeight: "15px",
            textAlign: "left",
            width: {
              xs: `${wrapperXS}vw`,
              sm: `${wrapperSM}vw`,
              md: `${wrapperMD}vw`,
              lg: `${wrapperDefault}vw`,
            },
            p: { xs: `${wrapperXSPadding}px`, sm: "unset" },
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {others.length > 3 ? (
            <strong>{`${others.length} persons`}</strong>
          ) : (
            others.map(({ name }, index) => (
              <>
                <strong key={index}>{name}</strong>
                {index < others.length - 1 ? <em> &amp; </em> : null}
              </>
            ))
          )}
          <Box component="span">
            {others.length > 1 ? " are" : " is"} typing...
          </Box>
        </Box>
      ) : null}
      <Box
        sx={{
          position: "relative",
          display: "inline-block",
          width: {
            xs: `${wrapperXS}vw`,
            sm: `${wrapperSM}vw`,
            md: `${wrapperMD}vw`,
            lg: `${wrapperDefault}vw`,
          },
          p: { xs: `${wrapperXSPadding}px`, sm: "unset" },
          mt: "7px",
          mb: "10px",
          borderRadius: "5px",
          lineHeight: "100%",
          boxSizing: "border-box",
        }}
      >
        <TextField
          fullWidth
          sx={{
            height: "50px",
            position: "relative",
            display: "inline-block",
            mb: 0,
            pl: "20px",
            pr: "12%",
            float: "left",
            borderStyle: "none",
            borderRadius: "5px",
            backgroundColor: "#e4e4e4",
            color: "#333",
            fontSize: "18px",
            boxSizing: "border-box",
            outline: 0,
          }}
          placeholder="Start typing here"
          autoFocus
          value={message}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              send();
            }
          }}
          onChange={(e) => {
            setMessage(e.target.value);
            setTyping(true);
            if (timer.current) {
              clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
              setTyping(false);
            }, TYPING_TIMEOUT);
          }}
          autoComplete="off"
        />
        <Button
          sx={{
            position: "absolute",
            right: 0,
            display: "block",
            width: "10%",
            height: "50px",
            border: 0,
            borderTopRightRadius: "5px",
            borderBottomRightRadius: "5px",
            backgroundColor: "#6bba6b",
            backgroundImage: `url(${msgSend})`,
            backgroundPosition: "50% 50%",
            backgroundSize: "40px",
            backgroundRepeat: "no-repeat",
            color: "rgba(51, 51, 51, 0)",
            outline: 0,
            cursor: "pointer",
          }}
          onClick={send}
        ></Button>
      </Box>
    </Box>
  );
};
