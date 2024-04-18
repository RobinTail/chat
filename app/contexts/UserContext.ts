import { createContext } from "react";

export const UserContext = createContext<{
  oauthID: null | string;
  name: null | string;
  provider: null | string;
  avatar: null | string;
  sounds: boolean;
  setSounds: (next: boolean) => void;
}>({
  oauthID: null,
  name: null,
  provider: null,
  avatar: null,
  sounds: false,
  setSounds: () => {},
});
