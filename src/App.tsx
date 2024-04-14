import Box from "@mui/material/Box";
import React from "react";
import { useSearchParams } from "react-router-dom";
import useLocalStorageState from "use-local-storage-state";
import { Chat } from "./components/Chat.tsx";
import { Modal } from "./components/Modal.tsx";
import { ModalContext } from "./contexts/ModalContext.ts";
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

export const App = () => {
  const [params] = useSearchParams();
  const [user, setUser, { removeItem: logout }] = useLocalStorageState("user", {
    defaultValue: {
      oauthID: null as string | null,
      name: null as string | null,
      provider: null as string | null,
      avatar: null as string | null,
    },
  });
  const [sounds, setSounds] = React.useState(true);
  const [modalVisibility, setModalVisibility] = React.useState(false);
  const [notice, setNotice] = React.useState({ title: "", message: "" });

  React.useEffect(() => {
    if (params.has("oauthID") && params.has("name")) {
      setUser({
        oauthID: params.get("oauthID"),
        name: params.get("name"),
        provider: params.get("provider"),
        avatar: params.get("avatar"),
      });
    }
  }, []);

  const hideModal = React.useCallback(() => setModalVisibility(false), []);
  const notify = React.useCallback((title: string, message: string) => {
    setNotice({ title, message });
    setModalVisibility(true);
  }, []);

  return (
    <Box>
      <ModalContext.Provider
        value={{
          ...notice,
          isVisible: modalVisibility,
          hide: hideModal,
          notify,
        }}
      >
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
              <Header logout={logout} />
              <Chat />
            </UserContext.Provider>
          </Box>
        ) : (
          <Auth />
        )}
        <Modal />
      </ModalContext.Provider>
    </Box>
  );
};
