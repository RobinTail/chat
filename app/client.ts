import type { Socket as SocketBase } from "socket.io-client";

export namespace Root {
  /** @desc The actual path of the Root namespace */
  export const path = "/";
  export interface Emission {
    enter_chat: (user: {
      oauthID: string;
      name: string;
      provider: "facebook" | "twitter" | "google";
      avatar: string;
    }) => void;
    leave_chat: (user: {
      oauthID: string;
      name: string;
      provider: "facebook" | "twitter" | "google";
      avatar: string;
    }) => void;
    new_messages: (
      p1: {
        /** user */
        author: {
          oauthID: string;
          name: string;
          provider: "facebook" | "twitter" | "google";
          avatar: string;
        };
        at: Date;
        text: string;
      }[],
    ) => void;
    typing: (p1: string[]) => void;
  }
  export interface Actions {
    submit: (text: string) => void;
    typing: (p1: boolean) => void;
  }
  /** @example const socket: Root.Socket = io(Root.path) */
  export type Socket = SocketBase<Emission, Actions>;
}
