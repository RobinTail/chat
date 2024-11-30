import { Icon } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import React from "react";
import { ModalContext } from "../contexts/ModalContext.ts";

export const Modal = () => {
  const { isVisible, title, message, hide } = React.useContext(ModalContext);

  return (
    <Dialog open={isVisible} onClose={hide} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <IconButton
        onClick={hide}
        sx={{ top: "10px", right: "10px", position: "absolute" }}
      >
        <Icon>close</Icon>
      </IconButton>
      <DialogContent>{message}</DialogContent>
    </Dialog>
  );
};
