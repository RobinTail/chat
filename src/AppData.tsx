import React from "react";

export const AppData = React.createContext<{
  get: (name: string) => unknown;
  set: (name: string, value: unknown) => void;
}>({
  get: () => undefined,
  set: () => {},
});
