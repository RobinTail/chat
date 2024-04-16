import appData from "../AppData.js";
import io from "socket.io-client";
import EventEmitter from "events";

const MESSAGE_EVENT = "messages";
const TYPING_EVENT = "typing";

export default new (class ChatAPI extends EventEmitter {
  constructor() {
    super();
    this._areLatestReceived = false;
    this._socket = null;
    this._lastOwnMessageNumber = 0;

    if (appData.get("isAuthenticated")) {
      this._socket = io.connect(document.location.origin);
      this._socket.on("leave_chat", this._leaveChat.bind(this));
      this._socket.on("new", this._newMessages.bind(this));
      this._socket.on("start_typing", this._theyStartTyping.bind(this));
      this._socket.on("stop_typing", this._theyStopTyping.bind(this));
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
})();
