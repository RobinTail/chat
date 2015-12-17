var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Session = mongoose.model('Session', {
    _id: String,
    session: String,
    expires: Date,
    isTest: Boolean
});

module.exports = Session;
