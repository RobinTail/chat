var io = require('socket.io-client');
var Reflux = require('reflux');
var Actions = require('../actions.jsx');
var appData = require('../appData.jsx');

if (appData('isAuthenticated')) {
    console.log('opening io connection');
    var socket = io.connect(document.location.origin);
}

module.exports = Reflux.createStore({
    listenables: [Actions],
    messages: [],
    init: function() {
        if (appData('isAuthenticated')) {
            console.log('listening to io response');
            socket.on('latest', function(data) {
                this.afterLatestChatMessages(data);
            }.bind(this));
            socket.on('connect_error', function(err) {
                if (this.messages.length) {
                    var last = this.messages[this.messages.length - 1];
                    if (last.isCritical && last.text === 'Connection lost') {
                        return;
                    }
                }
                this.messages.push({
                    name: 'System',
                    isSystem: true,
                    isCritical: true,
                    text: 'Connection lost'
                });
                this.triggerChange();
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
        socket.emit('submit', {message: message});
    },
    triggerChange: function() {
        this.trigger('change', this.messages);
    }
});
