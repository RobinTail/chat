var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

module.exports = function(mongoose) {
    return session({
        resave: false,
        saveUninitialized: false,
        secret: 'robintail/chat/session/secret',
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    });
};
