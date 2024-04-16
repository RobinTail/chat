import * as chatCore from "./chatCore";

export function ioConnect(socket) {
  chatCore.sendLatestMessages(socket);
}
