import Chat from '../schema/chat';
import myconsole from './console';

/**
 * Latest messages quantity
 */
const latestQuantity = 5;

/**
 * Send error message via socket
 * Uses action 'new'
 *
 * @param {socketIo.Socket} socket
 * @param {String} message
 */
export function sendError(socket, message) {
    socket.emit('new', {
        error: true,
        message: message
    });
}

/**
 * Send latest messages via socket
 * Uses action 'latest'
 *
 * @param {socketIo.Socket} socket
 * @param {ChatMessage[]} messages
 */
function sendLatestMessages(socket, messages) {
    socket.emit('latest', {
        error: false,
        messages: messages
    });
}

/**
 * Send new messages via socket
 * Uses action 'new'
 *
 * @param {socketIo.Socket} socket
 * @param {ChatMessage[]} messages
 * @param {Boolean} broadcastOnly Send only to others
 */
function sendNewMessages(socket, messages, broadcastOnly) {
    let obj = {
        error: false,
        messages: messages
    };
    if (!broadcastOnly) {
        socket.emit('new', obj);
    }
    // turn off isMy property for broadcasting
    obj.messages.forEach(message => {message.isMy = false;});
    socket.broadcast.emit('new', obj);
}

/**
 * Find messages and send them to socket
 * By default find latest messages
 * With argument broadcastOne find one message for broadcasting
 *
 * @param {socketIo.Socket} socket
 * @param {String} [broadcastOne] Find only this ID and broadcast it
 */
function findAndFeed(socket, broadcastOne) {
    let preFetch = Chat.find(broadcastOne ? {'_id': broadcastOne} : {});
    preFetch
        .sort({at: -1})
        .limit(latestQuantity)
        .populate('userID', 'name avatar provider')
        .exec(function(err, messages) {
            if (err) {
                myconsole.log('can not get messages from db: %s', err);
                sendError(socket, 'Error fetching messages');
                return false;
            }
            messages = messages.reverse().map(message => ({
                name: message.userID ? message.userID.name : 'Unknown',
                avatar: message.userID ? message.userID.avatar : null,
                provider: message.userID ? message.userID.provider : null,
                text: message.text,
                // jscs:disable maximumLineLength
                isMy: message.userID ?
                    socket.handshake.session.passport.user == message.userID._id : false
                // jscs:enable maximumLineLength
            }));
            if (broadcastOne) {
                myconsole.log('broadcasting');
                sendNewMessages(socket, messages);
            } else {
                myconsole.log('feeding latest %s', messages.length);
                sendLatestMessages(socket, messages);
            }
        });
}

/**
 * Handles an event when user enters chat
 *
 * @param {socketIo.Socket} socket
 */
export function enterChat(socket) {
    let message = {
        name: 'System',
        isSystem: true,
        text: socket.handshake.session.passport.userName + ' (' +
            socket.handshake.session.passport.provider + ') enters chat'
    };
    sendNewMessages(socket, [message], true);
    myconsole.log('enter chat info sent');
}

/**
 * Handles an events when user leaves chat
 *
 * @param {socketIo.Socket} socket
 */
export function leaveChat(socket) {
    let message = {
        name: 'System',
        isSystem: true,
        text: socket.handshake.session.passport.userName + ' (' +
            socket.handshake.session.passport.provider + ') leaves chat'
    };
    sendNewMessages(socket, [message], true);
    myconsole.log('leave chat info sent');
}

/**
 * Handles an event when user requests latest messages
 * Fires after client UI loaded
 *
 * @param {socketIo.Socket} socket
 */
export function latest(socket) {
    findAndFeed(socket);
}

/**
 * Handles an event when user submits new message
 *
 * @param {socketIo.Socket} socket
 * @param {{text: String}} data
 */
export function submit(socket, data) {
    let message = new Chat({
        userID: socket.handshake.session.passport.user,
        at: Date.now(),
        text: data.text
    });
    message.save(function(err) {
        if (err) {
            sendError(socket, 'Error submitting message');
            return false;
        }
        myconsole.log('message saved in db');
        findAndFeed(socket, message._id);
    }.bind(this));
}

/**
 * Handles an event when user starts typing
 *
 * @param {socketIo.Socket} socket
 */
export function startTyping(socket) {
    socket.broadcast.emit('start_typing', {
        id: socket.handshake.session.passport.user,
        name: socket.handshake.session.passport.userName
    });
}

/**
 * Handles an event when user stops typing
 *
 * @param {socketIo.Socket} socket
 */
export function stopTyping(socket) {
    socket.broadcast.emit('stop_typing', {
        id: socket.handshake.session.passport.user,
        name: socket.handshake.session.passport.userName
    });
}

/**
 * @typedef {Object} ChatMessage
 * @property {String} name
 * @property {String} avatar
 * @property {String} provider
 * @property {String} text
 * @property {Boolean} isMy
 */
