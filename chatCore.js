var Chat = require('./chat');

var latestQuantity = 5;

function sendError(socket, message) {
    socket.emit('latest', {
        error: true,
        message: message
    });
}

function sendMessages(socket, messages, forBroadcast) {
    var obj = forBroadcast ? socket.broadcast : socket;
    obj.emit('latest', {
        error: false,
        messages: messages
    });
}

module.exports.enterChat = function(socket) {
    var message = {
        name: 'System',
        isSystem: true,
        text: socket.handshake.session.userName + ' enters chat'
    };
    console.log('enter chat info sent');
    sendMessages(socket, [message], true);
};

module.exports.leaveChat = function(socket) {
    var message = {
        name: 'System',
        isSystem: true,
        text: socket.handshake.session.userName + ' leaves chat'
    };
    console.log('leave chat info sent');
    sendMessages(socket, [message], true);
};

module.exports.latest = function(socket, broadcastOne) {
    var preFetch = Chat.find(broadcastOne ? {'_id': broadcastOne} : {});
    preFetch
        .sort({at: -1})
        .limit(latestQuantity)
        .populate('userID', 'name')
        .exec(function(err, messages) {
            if (err) {
                console.log('can not get messages from db: %s', err);
                sendError(socket, 'Error fetching messages');
                return false;
            }
            messages = messages.reverse().map(function(message) {
                return {
                    name: message.userID ? message.userID.name : 'Unknown',
                    text: message.text,
                    // jscs:disable maximumLineLength
                    isMy: message.userID ?
                            socket.handshake.session.passport.user == message.userID._id :
                            false
                    // jscs:enable maximumLineLength
                };
            });
            console.log('feeding latest messages (%s)',
                messages.length);
            sendMessages(socket, messages);
            if (broadcastOne) {
                console.log('broadcasting');
                // turn off isMy property for broadcasting
                messages.map(function(message) {
                    message.isMy = false;
                    return message;
                });
                sendMessages(socket, messages, true);
            }
        });
};

module.exports.submit = function(socket, data) {
    var message = new Chat({
        userID: socket.handshake.session.passport.user,
        at: Date.now(),
        text: data.message
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
