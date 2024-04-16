import Message from "./message";
import myconsole from "./console";

const latestQuantity = 10;

/**
 * Send (broadcasts to others) new messages via socket
 * Uses action 'new'
 *
 * @param {socketIo.Socket} socket
 * @param {Message[]} messages
 * @param {Object} options
 */
function broadcastMessages(socket, messages, options) {
  let obj = Object.assign(
    {
      error: false,
      messages: messages,
    },
    options,
  );
  socket.broadcast.emit("new", obj);
}

/**
 * Sends latest messages
 *
 * @param {socketIo.Socket} socket
 */
export function sendLatestMessages(socket) {
  Message.find()
    .sort({ at: -1 })
    .limit(latestQuantity)
    .exec((err, messages) => {
      myconsole.log("feed latest", messages.length);
      let obj = {
        error: false,
        messages: messages.reverse(),
        areLatest: true,
      };
      socket.emit("new", obj);
    });
}
