import Box from "@mui/material/Box";
import React from "react";
import { ModalContext } from "../contexts/ModalContext.ts";
import Typography from "@mui/material/Typography";

export const Modal = () => {
  const { isVisible, title, message, hide } = React.useContext(ModalContext);
  if (!isVisible) return null;
  return (
    <Box>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 1050,
          outline: 0,
          overflowX: "hidden",
          overflowY: "auto",
        }}
        onClick={hide}
      >
        <Box
          sx={{
            width: { xs: "90%", sm: "75%" },
            m: { xs: "50px auto", sm: "100px auto" },
            backgroundColor: "#fff",
            backgroundClip: "padding-box",
            border: "1px solid rgba(0,0,0,.2)",
            borderRadius: "6px",
            outline: 0,
            boxShadow: "0 3px 9px rgba(0,0,0,.5)",
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Box
            sx={{
              position: "relative",
              p: "15px",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <Typography component="h4" sx={{ m: 0, lineHeight: "25px" }}>
              {title}
            </Typography>
            <Typography
              component="span"
              sx={{
                position: "absolute",
                right: "20px",
                top: "10px",
                cursor: "pointer",
                color: "rgba(0,0,0,0.3)",
                fontSize: "35px",
                "&:hover": { color: "rgba(0,0,0,0.8)" },
              }}
              onClick={hide}
            >
              &times;
            </Typography>
          </Box>
          <Box sx={{ position: "relative", p: "15px" }}>{message}</Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 1040,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      ></Box>
    </Box>
  );
};
