import io from 'socket.io-client';
import Reflux from 'reflux';
import Actions from '../actions';
import appData from '../appData';
import chatProcessor from './chatProcessor';

if (appData.get('isAuthenticated')) {
    var socket = io.connect(document.location.origin);
}

// todo: move socket event handles to Actions

export default Reflux.createStore({
    listenables: [Actions],
    messages: [],
    typing: [],
    isLatestReceived: false,
    isConnectionLost: false,
    init: function() {
        if (appData.get('isAuthenticated')) {
            socket.on('connect', function() {
                this.afterConnected();
            }.bind(this));
            socket.on('connect_error', function(err) {
                this.afterConnectionLost(err);
            }.bind(this));
            socket.on('latest', function(data) {
                this.afterLatestChatMessages(data);
            }.bind(this));
            socket.on('new', function(data) {
                this.newChatMessages(data);
            }.bind(this));
            socket.on('start_typing', function(data) {
                this.heStartTypingChatMessage(data);
            }.bind(this));
            socket.on('stop_typing', function(data) {
                this.heStopTypingChatMessage(data);
            }.bind(this));
        }
    },
    afterConnected: function() {
        if (this.isConnectionLost) {
            this.isConnectionLost = false;
            this.messages.push({
                name: 'System',
                isSystem: true,
                text: 'Connected'
            });
            this.triggerChange('messages');
        }
    },
    afterConnectionLost: function(err) {
        if (!this.isConnectionLost) {
            this.isConnectionLost = true;
            this.messages.push({
                name: 'System',
                isSystem: true,
                isCritical: true,
                text: 'Connection lost'
            });
            this.triggerChange('messages');
        }
    },
    getLatestChatMessages: function() {
        socket.emit('latest');
        let checkLoaded = new Promise(function(resolve, reject) {
            window.setTimeout(function() {
                if (this.isLatestReceived) {
                    resolve();
                } else {
                    reject();
                }
            }.bind(this), 3000);
        }.bind(this));
        checkLoaded.catch(function() {
            //console.log('response timeout');
            this.getLatestChatMessages();
        }.bind(this));
    },
    afterLatestChatMessages: function(data) {
        if (!this.isLatestReceived) {
            this.isLatestReceived = true;
            this.newChatMessages(data);
        }
    },
    newChatMessages: function(data) {
        if (data.error) {
            this.messages.push({
                name: 'System',
                isSystem: true,
                isCritical: true,
                text: data.message
            });
        } else {
            if (this.isLatestReceived) {
                data.messages.forEach(function(message) {
                    this.messages.push(message);
                }.bind(this));
                chatProcessor();
                this.triggerChange('messages');
            }
        }
    },
    submitChatMessage: function(message) {
        socket.emit('submit', {text: message});
    },
    iStartTypingChatMessage: function() {
        socket.emit('start_typing');
    },
    iStopTypingChatMessage: function() {
        socket.emit('stop_typing');
    },
    heStartTypingChatMessage: function(data) {
        this.typing.push(data);
        this.triggerChange('typing');
    },
    heStopTypingChatMessage: function(data) {
        this.typing.splice(this.typing.indexOf(data.id), 1);
        this.triggerChange('typing');
    },
    setChatSounds: function(value) {
        socket.emit('sounds', value);
    },
    triggerChange: function(section) {
        this.trigger(section);
    }
});
