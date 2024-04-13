import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import { mergeSx } from "merge-sx";
import React from "react";
import { version } from "../../package.json";
import { UserContext } from "../contexts/UserContext.ts";
import soundOn from "../assets/sound-on.svg";
import soundOff from "../assets/sound-off.svg";
import logout from "../assets/logout.svg";

const btnSx: SxProps = {
  display: "inline-block",
  width: "20px",
  height: "20px",
  verticalAlign: "middle",
  mt: "4px",
  mr: "20px",
  cursor: "pointer",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
};

export const Header = () => {
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
        <Box
          sx={mergeSx(btnSx, {
            backgroundImage: `url(${sounds ? soundOn : soundOff})`,
          })}
          onClick={() => setSounds(!sounds)}
        ></Box>
        <Box
          sx={mergeSx(btnSx, { backgroundImage: `url(${logout})` })}
          onClick={() => {
            window.location.replace("http://localhost:8090/logout");
          }}
        ></Box>
      </Box>
    </Box>
  );
};
