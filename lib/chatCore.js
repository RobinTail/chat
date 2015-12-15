var Chat = require('../schema/chat');

/**
 * Latest messages quantity
 *
 * @type {number}
 */
var latestQuantity = 5;

/**
 * Send error message via socket
 * Use action 'new'
 *
 * @param {object} socket
 * @param {string} message
 */
function sendError(socket, message) {
    socket.emit('new', {
        error: true,
        message: message
    });
}

/**
 * Send latest messages via socket
 * Use action 'latest'
 *
 * @param {object} socket
 * @param {object[]} messages
 */
function sendLatestMessages(socket, messages) {
    socket.emit('latest', {
        error: false,
        messages: messages
    });
}

/**
 * Send new messages via socket
 * Use action 'new'
 *
 * @param {object} socket
 * @param {object[]} messages
 * @param {boolean} broadcastOnly Send only to others
 */
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

/**
 * Find messages and send them to socket
 * By default find latest messages
 * With argument broadcastOne find one message for broadcasting
 *
 * @param {object} socket
 * @param {(string|undefined)} broadcastOne Find only this ID and broadcast it
 */
function findAndFeed(socket, broadcastOne) {
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
}

/**
 * Handles an event when user enters chat
 *
 * @param {object} socket
 */
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

/**
 * Handles an events when user leaves chat
 *
 * @param {object} socket
 */
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

/**
 * Handles an event when user request latest messages
 * Fires after client UI loaded
 *
 * @param {object} socket
 */
module.exports.latest = function(socket) {
    findAndFeed(socket);
};

/**
 * Handles an event when user submit new message
 *
 * @param {object} socket
 * @param {object} data
 */
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
        findAndFeed(socket, message._id);
    }.bind(this));
};

/**
 * Handles an event when user starts typing
 *
 * @param {object} socket
 */
module.exports.startTyping = function(socket) {
    socket.broadcast.emit('start_typing', {
        id: socket.handshake.session.passport.user,
        name: socket.handshake.session.passport.userName
    });
};

/**
 * Handles an event when user stops typing
 *
 * @param {object} socket
 */
module.exports.stopTyping = function(socket) {
    socket.broadcast.emit('stop_typing', {
        id: socket.handshake.session.passport.user,
        name: socket.handshake.session.passport.userName
    });
};
