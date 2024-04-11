import * as chatCore from "./chatCore";

export function ioConnect(socket) {
  socket.on("submit", (data) => {
    chatCore.submit(socket, data);
  });
  socket.on("start_typing", () => {
    chatCore.startTyping(socket);
  });
  socket.on("stop_typing", () => {
    chatCore.stopTyping(socket);
  });
  socket.on("sounds", (value) => {
    chatCore.setSounds(socket, value);
  });
  socket.on("disconnect", () => {
    chatCore.leaveChat(socket);
  });

  chatCore.enterChat(socket);
  chatCore.sendLatestMessages(socket);
}
