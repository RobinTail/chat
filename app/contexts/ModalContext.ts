import React from "react";

export const ModalContext = React.createContext<{
  title: string;
  message: string;
  isVisible: boolean;
  hide: () => void;
  notify: (title: string, message: string) => void;
}>({
  title: "",
  message: "",
  isVisible: false,
  hide: () => {},
  notify: () => {},
});
