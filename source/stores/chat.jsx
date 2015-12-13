var io = require('socket.io-client');
var Reflux = require('reflux');
var Actions = require('../actions.jsx');
var appData = require('../appData.jsx');

if (appData('isAuthenticated')) {
    var socket = io.connect(document.location.origin);
}

module.exports = Reflux.createStore({
    listenables: [Actions],
    messages: [],
    typing: [],
    isConnectionLost: false,
    init: function() {
        if (appData('isAuthenticated')) {
            socket.on('connect', function() {
                if (this.isConnectionLost) {
                    this.isConnectionLost = false;
                    this.messages.push({
                        name: 'System',
                        isSystem: true,
                        text: 'Connected'
                    });
                    this.triggerChange();
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
                    this.triggerChange();
                }
            }.bind(this));
            socket.on('latest', function(data) {
                this.afterLatestChatMessages(data);
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
        if (data.error) {
            this.messages.push({
                name: 'System',
                isSystem: true,
                isCritical: true,
                text: data.message
            });
        } else {
            data.messages.forEach(function(message) {
                this.messages.push(message);
            }.bind(this));
            this.triggerChange('messages');
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
    triggerChange: function(section) {
        this.trigger(section);
    }
});
