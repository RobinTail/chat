import mongoose from 'mongoose';

const Session = mongoose.model('Session', {
    _id: String,
    session: String,
    expires: Date,
    isTest: Boolean
});

export default Session;
