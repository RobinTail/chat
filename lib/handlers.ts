import * as chatCore from "./chatCore";
import myconsole from "./console";

function isPropertyDefined(obj, path) {
  path.split(".").forEach((key) => {
    obj = obj && obj[key];
  });
  return typeof obj != "undefined" && obj !== null;
}

function checkSocketAuth(socket) {
  if (isPropertyDefined(socket, "handshake.session.passport.user._id")) {
    return true;
  }
  myconsole.log("User not authenticated");
  return false;
}

export function ioConnect(socket) {
  myconsole.log("new io connection");
  if (!checkSocketAuth(socket)) {
    return;
  }

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

  const sessionUser = socket.handshake.session.passport.user;
  myconsole.log(
    "authenticated user %s (%s)",
    sessionUser.name,
    sessionUser.provider,
  );
  chatCore.enterChat(socket);
  chatCore.sendLatestMessages(socket);
}
