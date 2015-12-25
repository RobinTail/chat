import io from 'socket.io-client';
import Reflux from 'reflux';
import Actions from '../actions';
import appData from '../appData';
import * as processor from './chatProcessor';

if (appData.get('isAuthenticated')) {
    var socket = io.connect(document.location.origin);
}

export default Reflux.createStore({
    listenables: [Actions],
    messages: [],
    typing: [],
    isLatestReceived: false,
    isConnectionLost: false,
    isDateMessagePosted: false,
    init: function() {
        if (appData.get('isAuthenticated')) {
            socket.on('connect', Actions.afterChatConnected);
            socket.on('connect_error', Actions.afterChatConnectionLost);
            socket.on('latest', Actions.afterLatestChatMessages);
            socket.on('new', Actions.newChatMessages);
            socket.on('start_typing', Actions.theyStartTypingChatMessage);
            socket.on('stop_typing', Actions.theyStopTypingChatMessage);
        }
    },
    afterChatConnected: function() {
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
    afterChatConnectionLost: function(err) {
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
                processor.preprocess();
                Actions.fetchEmbedIntoChatMessages();
                this.triggerChange('messages');
            }
        }
    },
    fetchEmbedIntoChatMessages: function() {
        processor.embedly();
        this.triggerChange('messages');
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
    theyStartTypingChatMessage: function(data) {
        this.typing.push(data);
        this.triggerChange('typing');
    },
    theyStopTypingChatMessage: function(data) {
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
