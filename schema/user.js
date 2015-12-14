var mongoose = require('mongoose');

var User = mongoose.model('User', {
    oauthID: Number,
    name: String,
    created: Date,
    provider: String,
    avatar: String,
    sounds: Boolean
});

module.exports = User;
