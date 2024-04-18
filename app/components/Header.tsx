import Logout from "@mui/icons-material/Logout";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOff from "@mui/icons-material/VolumeOff";
import IconButton from "@mui/material/IconButton";
import type { SxProps } from "@mui/material/";
import Box from "@mui/material/Box";
import React from "react";
import { version } from "../../package.json";
import { UserContext } from "../contexts/UserContext.ts";

const btnSx: SxProps = {
  p: 0,
  mt: "4px",
  mr: "20px",
  color: "black",
};

export const Header = ({ logout }: { logout: () => void }) => {
  const { sounds, setSounds } = React.useContext(UserContext);
  return (
    <Box>
      <Box
        sx={{
          position: "fixed",
          left: 0,
          top: 0,
          display: "inline-block",
          width: { xs: "100%", md: "160px" },
          height: "30px",
          padding: "0 10px 0 20px",
          backgroundColor: {
            xs: "rgba(0, 0, 0, 0.75)",
            md: "rgba(0, 0, 0, 0.8)",
          },
          color: "white",
          fontSize: "15px",
          lineHeight: "30px",
          fontStyle: "italic",
          fontWeight: 700,
          textAlign: { xs: "left", md: "center" },
          zIndex: { xs: 10, md: "unset" },
        }}
      >
        ⧓&nbsp;Robichat
        <Box
          component="span"
          sx={{
            position: "relative",
            bottom: "5px",
            ml: "5px",
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: "13px",
            fontStyle: "normal",
          }}
        >
          {version}
        </Box>
      </Box>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          display: "inline-block",
          height: "30px",
          zIndex: { xs: 200, md: "unset" },
          backgroundColor: { xs: "#26c0de", md: "rgba(38, 192, 222, 0.6)" },
          textAlign: "center",
          pl: "20px",
        }}
      >
        <IconButton sx={btnSx} onClick={() => setSounds(!sounds)}>
          {sounds ? <VolumeUp /> : <VolumeOff />}
        </IconButton>
        <IconButton
          sx={btnSx}
          onClick={() => {
            logout();
            window.location.replace(`${coreUrl}/logout`);
          }}
        >
          <Logout />
        </IconButton>
      </Box>
    </Box>
  );
};
