import Box from "@mui/material/Box";
import useLocalStorageState from "use-local-storage-state";
import {
  wrapperDefault,
  wrapperMD,
  wrapperSM,
  wrapperXS,
  wrapperXSPadding,
} from "./vars.tsx";
import { Auth } from "./components/Auth.tsx";
/*
import Header from "../header/header";
import Modal from "../modal/modal";
import Chat from "../chat/chat";
 */

export const App = () => {
  const [isAuthenticated] = useLocalStorageState("isAuthenticated", {
    defaultValue: false,
  });

  return (
    <Box>
      {isAuthenticated ? (
        <Box
          sx={{
            mx: "auto",
            maxWidth: {
              xs: `${wrapperXS}`,
              sm: `${wrapperSM}vw`,
              md: `${wrapperMD}vw`,
              lg: `${wrapperDefault}vw`,
            },
            px: {
              xs: `0 ${wrapperXSPadding}`,
              sm: 0,
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              background: "#eee",
              position: "fixed",
              left: 0,
              top: 0,
              zIndex: -1,
            }}
          />
          [Header] [Chat]
        </Box>
      ) : (
        <Auth />
      )}
      [Modal]
    </Box>
  );
};
