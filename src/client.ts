import type { Socket as SocketBase } from "socket.io-client";

export namespace Root {
  /** @desc The actual path of the Root namespace */
  export const path = "/";
  export interface Emission {
    enter_chat: (p1: {
      oauthID: string;
      name: string;
      provider: string;
      avatar: string;
    }) => void;
  }
  export interface Actions {}
  /** @example const socket: Root.Socket = io(Root.path) */
  export type Socket = SocketBase<Emission, Actions>;
}
