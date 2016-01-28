import User from '../schema/user';
import Message from '../schema/message';
import myconsole from './console';

const latestQuantity = 10;

/**
 * Send (broadcasts to others) new messages via socket
 * Uses action 'new'
 *
 * @param {socketIo.Socket} socket
 * @param {Message[]} messages
 */
function broadcastMessages(socket, messages) {
    let obj = {
        error: false,
        messages: messages
    };
    socket.broadcast.emit('new', obj);
}

/**
 * Handles an event when user enters chat
 *
 * @param {socketIo.Socket} socket
 */
export function enterChat(socket) {
    let message = {
        author: {
            name: 'System'
        },
        isSystem: true,
        isWarning: true,
        at: new Date(),
        text: socket.handshake.session.passport.user.name + ' (' +
            socket.handshake.session.passport.user.provider + ') enters chat'
    };
    broadcastMessages(socket, [message]);
    myconsole.log('enter chat info sent');
}

/**
 * Handles an events when user leaves chat
 *
 * @param {socketIo.Socket} socket
 */
export function leaveChat(socket) {
    let message = {
        author: {
            name: 'System'
        },
        isSystem: true,
        isWarning: true,
        at: new Date(),
        text: socket.handshake.session.passport.user.name + ' (' +
            socket.handshake.session.passport.user.provider + ') leaves chat'
    };
    broadcastMessages(socket, [message]);
    myconsole.log('leave chat info sent');
}

/**
 * Sends latest messages
 *
 * @param {socketIo.Socket} socket
 */
export function sendLatestMessages(socket) {
    Message.find().sort({at: -1}).limit(latestQuantity).exec((err, messages) => {
        myconsole.log('feed latest', messages.length);
        let obj = {
            error: false,
            messages: messages.reverse()
        };
        socket.emit('new', obj);
    });
}

/**
 * Handles an event when user submits new message
 *
 * @param {socketIo.Socket} socket
 * @param {{text: String}} data
 */
export function submit(socket, data) {
    let message = new Message({
        author: {
            id: socket.handshake.session.passport.user._id,
            name: socket.handshake.session.passport.user.name,
            provider: socket.handshake.session.passport.user.provider,
            avatar: socket.handshake.session.passport.user.avatar
        },
        at: new Date(),
        text: data.text
    });
    message.save(() => {
        myconsole.log('message saved in db');
        broadcastMessages(socket, [message]);
    });
}

/**
 * Handles an event when user starts typing
 *
 * @param {socketIo.Socket} socket
 */
export function startTyping(socket) {
    socket.broadcast.emit('start_typing', {
        id: socket.handshake.session.passport.user._id,
        name: socket.handshake.session.passport.user.name
    });
}

/**
 * Handles an event when user stops typing
 *
 * @param {socketIo.Socket} socket
 */
export function stopTyping(socket) {
    socket.broadcast.emit('stop_typing', {
        id: socket.handshake.session.passport.user._id,
        name: socket.handshake.session.passport.user.name
    });
}

/**
 * Handles an event when user sets sounds
 *
 * @param {socketIo.Socket} socket
 * @param {Boolean} value
 */
export function setSounds(socket, value) {
    User.findById(socket.handshake.session.passport.user._id, (err, user) => {
        if (!err) {
            user.sounds = value;
            user.save((err) => {
                if (!err) {
                    myconsole.log('sounds set: ' + value);
                }
            });
        }
    });
}
