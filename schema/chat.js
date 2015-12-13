var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Chat = mongoose.model('Chat', {
    userID: {type: Schema.Types.ObjectId, ref: 'User'},
    at: Date,
    text: String
});

module.exports = Chat;
