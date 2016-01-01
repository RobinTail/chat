import appData from '../appData';
import io from 'socket.io-client';
import EventEmitter from 'events';

const MESSAGE_EVENT = 'messages';
const TYPING_EVENT = 'typing';

export default new class ChatAPI extends EventEmitter {

    constructor() {
        super();
        this._isLatestMessagesReceived = false;
        this._isConnectionLost = false;
        this._socket = null;

        if (appData.get('isAuthenticated')) {
            this._socket = io.connect(document.location.origin);
            this._socket.on('connect', this._afterConnected.bind(this));
            this._socket.on('connect_error', this._afterConnectionLost.bind(this));
            this._socket.on('latest', this._afterLatestMessages.bind(this));
            this._socket.on('new', this._newMessages.bind(this));
            this._socket.on('start_typing', this._theyStartTyping.bind(this));
            this._socket.on('stop_typing', this._theyStopTyping.bind(this));
        }
    }

    _afterConnected() {
        if (this._isConnectionLost) {
            this._isConnectionLost = false;
            this.emitMessages([{
                name: 'System',
                isSystem: true,
                text: 'Connected'
            }]);
        }
    }

    _afterConnectionLost(/*err*/) {
        if (!this._isConnectionLost) {
            this._isConnectionLost = true;
            this.emitMessages([{
                name: 'System',
                isSystem: true,
                isCritical: true,
                text: 'Connection lost'
            }]);
        }
    }

    getLatestMessages() {
        this._socket.emit('latest');
        let checkLoaded = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._isLatestMessagesReceived) {
                    resolve();
                } else {
                    reject();
                }
            }, 3000);
        });
        checkLoaded.catch(() => {
            this.getLatestMessages();
        });
    }

    _afterLatestMessages(data) {
        if (!this._isLatestMessagesReceived) {
            this._isLatestMessagesReceived = true;
            this._newMessages(data);
        }
    }

    _newMessages(data) {
        if (data.error) {
            this.emitMessages([{
                name: 'System',
                isSystem: true,
                isCritical: true,
                text: data.message
            }]);
        } else {
            if (this._isLatestMessagesReceived) {
                this.emitMessages(data.messages);
            }
        }
    }

    submitMessage(text) {
        this._socket.emit('submit', {text: text});
    }

    iStartTyping() {
        this._socket.emit('start_typing');
    }

    iStopTyping() {
        this._socket.emit('stop_typing');
    }

    _theyStartTyping(data) {
        this.emitTyping(data, true);
    }

    _theyStopTyping(data) {
        this.emitTyping(data, false);
    }

    setSounds(isEnabled) {
        this._socket.emit('sounds', isEnabled);
    }

    emitMessages(messages) {
        this.emit(MESSAGE_EVENT, messages, this._isLatestMessagesReceived);
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

};
