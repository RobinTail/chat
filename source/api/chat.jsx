import appData from '../appData';
import io from 'socket.io-client';
import EventEmitter from 'events';

const MESSAGE_EVENT = 'messages';
const TYPING_EVENT = 'typing';

export default new class ChatAPI extends EventEmitter {

    constructor() {
        super();
        this._isConnectionLost = false;
        this._socket = null;

        if (appData.get('isAuthenticated')) {
            this._socket = io.connect(document.location.origin);
            this._socket.on('connect', this._afterConnected.bind(this));
            this._socket.on('connect_error', this._afterConnectionLost.bind(this));
            this._socket.on('new', this._newMessages.bind(this));
            this._socket.on('start_typing', this._theyStartTyping.bind(this));
            this._socket.on('stop_typing', this._theyStopTyping.bind(this));
        }
    }

    _afterConnected() {
        if (this._isConnectionLost) {
            this._isConnectionLost = false;
            this.emitMessages([{
                author: {
                    name: 'System'
                },
                isSystem: true,
                text: 'Connected',
                at: new Date()
            }]);
        }
    }

    _afterConnectionLost(/*err*/) {
        if (!this._isConnectionLost) {
            this._isConnectionLost = true;
            this.emitMessages([{
                author: {
                    name: 'System'
                },
                isSystem: true,
                isCritical: true,
                text: 'Connection lost',
                at: new Date()
            }]);
        }
    }

    _newMessages(data) {
        this.emitMessages(data.messages);
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

};
