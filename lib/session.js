import session from 'express-session';
import connectMongo from 'connect-mongo';
const MongoStore = connectMongo(session);

export default mongoose => {
    return session({
        resave: false,
        saveUninitialized: false,
        secret: 'robintail/chat/session/secret',
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    });
};
