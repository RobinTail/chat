import Box from "@mui/material/Box";
import React from "react";
import { useSearchParams } from "react-router-dom";
import useLocalStorageState from "use-local-storage-state";
import { UserContext } from "./contexts/UserContext.ts";
import {
  wrapperDefault,
  wrapperMD,
  wrapperSM,
  wrapperXS,
  wrapperXSPadding,
} from "./vars.tsx";
import { Auth } from "./components/Auth.tsx";
import { Header } from "./components/Header.tsx";
/*
import Modal from "../modal/modal";
import Chat from "../chat/chat";
 */

export const App = () => {
  const [params] = useSearchParams();
  const [user] = useLocalStorageState("user", {
    defaultValue: {
      oauthID: params.get("oauthID"),
      name: params.get("name"),
      provider: params.get("provider"),
      avatar: params.get("avatar"),
    },
  });
  const [sounds, setSounds] = React.useState(true);

  return (
    <Box>
      {user.oauthID ? (
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
          <UserContext.Provider value={{ ...user, sounds, setSounds }}>
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
            <Header /> [Chat]
          </UserContext.Provider>
        </Box>
      ) : (
        <Auth />
      )}
      [Modal]
    </Box>
  );
};
