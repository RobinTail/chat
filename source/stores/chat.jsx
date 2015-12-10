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
        }
    },
    getLatestChatMessages: function() {
        console.log('send io request');
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
