import io from 'socket.io-client';
import Reflux from 'reflux';
import Actions from '../actions';
import appData from '../appData';

if (appData.get('isAuthenticated')) {
    var socket = io.connect(document.location.origin);
}

export default Reflux.createStore({
    listenables: [Actions],
    messages: [],
    typing: [],
    isLatestReceived: false,
    isConnectionLost: false,
    init: function() {
        if (appData.get('isAuthenticated')) {
            socket.on('connect', function() {
                if (this.isConnectionLost) {
                    this.isConnectionLost = false;
                    this.messages.push({
                        name: 'System',
                        isSystem: true,
                        text: 'Connected'
                    });
                    this.triggerChange('messages');
                }
            }.bind(this));
            socket.on('connect_error', function(err) {
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
    getLatestChatMessages: function() {
        console.log('send io request');
        socket.emit('latest');
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
                this.triggerChange('messages');
            }
        }
    },
    submitChatMessage: function(message) {
        console.log('submit message');
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
