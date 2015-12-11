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
            this.triggerChange();
        }
    },
    submitChatMessage: function(message) {
        console.log('submit message');
        socket.emit('submit', {text: message});
    },
    triggerChange: function() {
        this.trigger('change', this.messages);
    }
});
