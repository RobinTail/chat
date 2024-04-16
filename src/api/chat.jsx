import appData from "../AppData.js";
import io from "socket.io-client";
import EventEmitter from "events";

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
})();
