var io = require('socket.io-client');
var socket = io.connect(document.location.origin);
var Reflux = require('reflux');
var Actions = require('../actions.jsx');

module.exports = Reflux.createStore({
    listenables: [Actions],
    messages: [],
    init: function() {
        socket.on('latest', function(data) {
            this.afterLatestChatMessages(data);
        }.bind(this));
    },
    getLatestChatMessages: function() {
        socket.emit('latest');
    },
    afterLatestChatMessages: function(data) {
        //console.log(data);
        if (data.error) {
            console.log(data.message);
        } else {
            this.messages = data.messages;
            this.triggerChange();
        }
    },
    triggerChange: function() {
        this.trigger('change', this.messages);
    }
});
