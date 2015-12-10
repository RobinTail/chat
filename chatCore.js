var User = require('./user');
var Chat = require('./chat');

var latestQuantity = 5;

function checkAuth(socket) {
    if (!socket.handshake.session.passport) {
        console.log('user not authenticated');
        sendError(socket, 'Not authenticated request');
        return false;
    }
    return true;
}

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

module.exports.latest = function(socket, broadcastOne) {
    if (!checkAuth(socket)) { return false; }
    User.findById(socket.handshake.session.passport.user,
        function(err, user) {
            if (err) {
                console.log('user not found in db');
                sendError(socket, 'User not found');
                return false;
            }
            console.log('authenticated user ' + user.name);
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
                            name: message.userID.name,
                            text: message.text
                        };
                    });
                    console.log('feeding latest messages (%s)',
                        messages.length);
                    sendMessages(socket, messages);
                    if (broadcastOne) {
                        console.log('broadcasting');
                        sendMessages(socket, messages, true);
                    }
                });
        });
};

module.exports.submit = function(socket, data) {
    if (!checkAuth(socket)) { return false; }
    User.findById(socket.handshake.session.passport.user,
        function(err, user) {
            if (err) {
                console.log('user not found in db');
                sendError(socket, 'User not found');
                return false;
            }
            console.log('authenticated user ' + user.name);
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
        }.bind(this));
};
