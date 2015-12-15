var Chat = require('../schema/chat');

var latestQuantity = 5;

function sendError(socket, message) {
    socket.emit('new', {
        error: true,
        message: message
    });
}

function sendLatestMessages(socket, messages) {
    socket.emit('latest', {
        error: false,
        messages: messages
    });
}

function sendNewMessages(socket, messages, broadcastOnly) {
    var obj = {
        error: false,
        messages: messages
    };
    if (!broadcastOnly) {
        socket.emit('new', obj);
    }
    // turn off isMy property for broadcasting
    obj.messages.map(function(message) {
        message.isMy = false;
        return message;
    });
    socket.broadcast.emit('new', obj);
}

module.exports.enterChat = function(socket) {
    var message = {
        name: 'System',
        isSystem: true,
        text: socket.handshake.session.passport.userName + ' (' +
            socket.handshake.session.passport.provider + ') enters chat'
    };
    console.log('enter chat info sent');
    sendNewMessages(socket, [message], true);
};

module.exports.leaveChat = function(socket) {
    var message = {
        name: 'System',
        isSystem: true,
        text: socket.handshake.session.passport.userName + ' (' +
            socket.handshake.session.passport.provider + ') leaves chat'
    };
    console.log('leave chat info sent');
    sendNewMessages(socket, [message], true);
};

module.exports.latest = function(socket, broadcastOne) {
    var preFetch = Chat.find(broadcastOne ? {'_id': broadcastOne} : {});
    preFetch
        .sort({at: -1})
        .limit(latestQuantity)
        .populate('userID', 'name avatar provider')
        .exec(function(err, messages) {
            if (err) {
                console.log('can not get messages from db: %s', err);
                sendError(socket, 'Error fetching messages');
                return false;
            }
            messages = messages.reverse().map(function(message) {
                return {
                    name: message.userID ? message.userID.name : 'Unknown',
                    avatar: message.userID ? message.userID.avatar : false,
                    provider: message.userID ? message.userID.provider : false,
                    text: message.text,
                    // jscs:disable maximumLineLength
                    isMy: message.userID ?
                            socket.handshake.session.passport.user == message.userID._id :
                            false
                    // jscs:enable maximumLineLength
                };
            });
            if (broadcastOne) {
                console.log('broadcasting');
                sendNewMessages(socket, messages);
            } else {
                console.log('feeding latest %s', messages.length);
                sendLatestMessages(socket, messages);
            }
        });
};

module.exports.submit = function(socket, data) {
    var message = new Chat({
        userID: socket.handshake.session.passport.user,
        at: Date.now(),
        text: data.text
    });
    message.save(function(err) {
        if (err) {
            sendError(socket, 'Error submitting message');
            return false;
        }
        console.log('message saved in db');
        this.latest(socket, message._id);
    }.bind(this));
};

module.exports.startTyping = function(socket) {
    socket.broadcast.emit('start_typing', {
        id: socket.handshake.session.passport.user,
        name: socket.handshake.session.passport.userName
    });
};

module.exports.stopTyping = function(socket) {
    socket.broadcast.emit('stop_typing', {
        id: socket.handshake.session.passport.user,
        name: socket.handshake.session.passport.userName
    });
};
