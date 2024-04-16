import EventEmitter from "events";

export default new (class ChatAPI extends EventEmitter {
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
