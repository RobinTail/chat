import type { Socket as SocketBase } from "socket.io-client";

export namespace Root {
  /** @desc The actual path of the Root namespace */
  export const path = "/";
  export interface Emission {
    enter_chat: (user: {
      oauthID: string;
      name: string;
      provider: string;
      avatar: string;
    }) => void;
    new_messages: (
      p1: {
        /** user */
        author: {
          oauthID: string;
          name: string;
          provider: string;
          avatar: string;
        };
        at: Date;
        text: string;
      }[],
    ) => void;
  }
  export interface Actions {
    submit: (text: string) => void;
  }
  /** @example const socket: Root.Socket = io(Root.path) */
  export type Socket = SocketBase<Emission, Actions>;
}
