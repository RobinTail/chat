import ButtonBase from "@mui/material/ButtonBase";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import React from "react";
import Send from "@mui/icons-material/Send";
import {
  wrapperDefault,
  wrapperMD,
  wrapperSM,
  wrapperXS,
  wrapperXSPadding,
} from "../vars.tsx";

const TYPING_TIMEOUT = 800;

export const MessageComposer = ({
  onTyping,
  onSend,
  others,
}: {
  onTyping: (isTyping: boolean) => void;
  onSend: (msg: string) => void;
  others: string[];
}) => {
  const [message, setMessage] = React.useState("");
  const timer = React.useRef<NodeJS.Timeout>();

  const send = React.useCallback(() => {
    if (message.trim().length > 0) {
      onSend(message);
      setMessage("");
    }
  }, [message, onSend]);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        textAlign: "center",
        zIndex: 3,
        backgroundColor: "#eee",
        boxShadow: "#eee 0 0 20px 10px",
        width: {
          xs: `${wrapperXS}vw`,
          sm: `${wrapperSM}vw`,
          md: `${wrapperMD}vw`,
          lg: `${wrapperDefault}vw`,
        },
        p: { xs: `${wrapperXSPadding}px`, sm: "unset" },
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
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {others.length > 3 ? (
            <strong>{`${others.length} persons`}</strong>
          ) : (
            others.map((name, index) => (
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
          display: "flex",
          mt: "7px",
          mb: "10px",
          lineHeight: "100%",
          height: "50px",
        }}
      >
        <InputBase
          fullWidth
          sx={{
            display: "flex",
            px: 2,
            borderStyle: "none",
            backgroundColor: "#e4e4e4",
            color: "#333",
            fontSize: "18px",
            borderTopLeftRadius: "5px",
            borderBottomLeftRadius: "5px",
            "&.Mui-focused": { background: "white" },
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
            onTyping(true);
            if (timer.current) {
              clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
              onTyping(false);
            }, TYPING_TIMEOUT);
          }}
          autoComplete="off"
        />
        <ButtonBase
          sx={{
            borderTopRightRadius: "5px",
            borderBottomRightRadius: "5px",
            backgroundColor: "#6bba6b",
            cursor: "pointer",
            color: "white",
            px: 2,
          }}
          onClick={send}
        >
          <Send />
        </ButtonBase>
      </Box>
    </Box>
  );
};
