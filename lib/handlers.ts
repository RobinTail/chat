import * as chatCore from "./chatCore";

export function ioConnect(socket) {
  socket.on("start_typing", () => {
    chatCore.startTyping(socket);
  });
  socket.on("stop_typing", () => {
    chatCore.stopTyping(socket);
  });

  chatCore.sendLatestMessages(socket);
}
