import Icon from "@mui/material/Icon";
import ButtonBase from "@mui/material/ButtonBase";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import { mergeSx } from "merge-sx";
import React from "react";
import { wrapperSx, wrapperXSPadding } from "../wrapper.tsx";
import { SxProps } from "@mui/material/styles";

const TYPING_TIMEOUT = 800;

const composerSx: SxProps = {
  position: "fixed",
  bottom: 0,
  zIndex: 3,
  backgroundColor: "#eee",
  boxShadow: "#eee 0 0 20px 10px",
  ml: { xs: `-${wrapperXSPadding}px`, sm: "unset" },
};

const formSx: SxProps = {
  display: "flex",
  mt: "7px",
  mb: "10px",
  lineHeight: "100%",
  height: "50px",
};

const inputSx: SxProps = {
  display: "flex",
  px: 2,
  borderStyle: "none",
  backgroundColor: "#e4e4e4",
  color: "#333",
  fontSize: "18px",
  borderTopLeftRadius: "5px",
  borderBottomLeftRadius: "5px",
  "&.Mui-focused": { background: "white" },
};

const btnSx: SxProps = {
  borderTopRightRadius: "5px",
  borderBottomRightRadius: "5px",
  backgroundColor: "#6bba6b",
  cursor: "pointer",
  color: "white",
  px: 2,
};

const typingSx: SxProps = {
  zIndex: 100,
  fontStyle: "italic",
  color: "rgba(0, 0, 0, 0.4)",
  fontSize: "13px",
  lineHeight: "15px",
  textAlign: "left",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

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
    <Box sx={mergeSx(wrapperSx, composerSx)}>
      {others.length ? (
        <Box sx={typingSx}>
          {others.length > 3 ? (
            <strong>{`${others.length} persons`}</strong>
          ) : (
            others.map((name, index) => (
              <Box component="span" key={index}>
                <strong key={index}>{name}</strong>
                {index < others.length - 1 ? <em> &amp; </em> : null}
              </Box>
            ))
          )}
          <Box component="span">
            {others.length > 1 ? " are" : " is"} typing...
          </Box>
        </Box>
      ) : null}
      <Box sx={formSx}>
        <InputBase
          fullWidth
          sx={inputSx}
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
        <ButtonBase sx={btnSx} onClick={send}>
          <Icon>send</Icon>
        </ButtonBase>
      </Box>
    </Box>
  );
};
