import appData from "../AppData.js";
import io from "socket.io-client";
import EventEmitter from "events";

const MESSAGE_EVENT = "messages";
const TYPING_EVENT = "typing";

export default new (class ChatAPI extends EventEmitter {
  constructor() {
    super();
    this._isConnectionLost = false;
    this._areLatestReceived = false;
    this._socket = null;
    this._lastOwnMessageNumber = 0;
    this._onlineUsers = [];

    if (appData.get("isAuthenticated")) {
      this._socket = io.connect(document.location.origin);
      this._socket.on("enter_chat", this._enterChat.bind(this));
      this._socket.on("leave_chat", this._leaveChat.bind(this));
      this._socket.on("new", this._newMessages.bind(this));
      this._socket.on("start_typing", this._theyStartTyping.bind(this));
      this._socket.on("stop_typing", this._theyStopTyping.bind(this));
    }
  }

  _enterChat(data) {
    if (!this._onlineUsers.find((item) => item.id === data.id)) {
      this._onlineUsers.push(data);
      this.emitMessages([
        {
          author: {
            name: "System",
          },
          isSystem: true,
          isWarning: true,
          text: data.name + " (" + data.provider + ") enters chat.",
          at: new Date(),
        },
      ]);
    }
  }

  _leaveChat(data) {
    let i = this._onlineUsers.findIndex((item) => item.id === data.id);
    if (i !== -1) {
      this._onlineUsers.splice(i, 1);
      this.emitMessages([
        {
          author: {
            name: "System",
          },
          isSystem: true,
          isWarning: true,
          text: data.name + " (" + data.provider + ") leaves chat.",
          at: new Date(),
        },
      ]);
    }
  }

  _newMessages(data) {
    if (data.areLatest) {
      if (this._areLatestReceived) {
        return;
      }
      this._areLatestReceived = true;
    }
    this.emitMessages(data.messages);
  }

  submitMessage(text) {
    this._socket.emit("submit", { text: text });
    /* Issue #12: show submitted message immediately */
    this._lastOwnMessageNumber++;
    this.emitMessages([
      {
        _id: "_own_" + this._lastOwnMessageNumber,
        author: {
          id: appData.get("userID"),
          name: appData.get("name"),
          avatar: appData.get("avatar"),
          provider: appData.get("provider"),
        },
        text: text,
        at: new Date(),
      },
    ]);
  }

  iStartTyping() {
    this._socket.emit("start_typing");
  }

  iStopTyping() {
    this._socket.emit("stop_typing");
  }

  _theyStartTyping(data) {
    this.emitTyping(data, true);
  }

  _theyStopTyping(data) {
    this.emitTyping(data, false);
  }

  setSounds(isEnabled) {
    this._socket.emit("sounds", isEnabled);
  }

  emitMessages(messages) {
    this.emit(MESSAGE_EVENT, messages);
  }

  emitTyping(data, isStart) {
    this.emit(TYPING_EVENT, data, isStart);
  }

  addMessagesListener(callback) {
    this.on(MESSAGE_EVENT, callback);
  }

  removeMessagesListener(callback) {
    this.removeListener(MESSAGE_EVENT, callback);
  }

  addTypingListener(callback) {
    this.on(TYPING_EVENT, callback);
  }

  removeTypingListener(callback) {
    this.removeListener(TYPING_EVENT, callback);
  }
})();
