var mongoose = require('mongoose');

var User = mongoose.model('User', {
    oauthID: Number,
    name: String,
    created: Date,
    provider: String
});

module.exports = User;
