var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Chat = mongoose.model('Chat', {
    userID: {type: Schema.Types.ObjectId, ref: 'User'},
    at: {type: Date, expires: '1h'},
    text: String
});

module.exports = Chat;
