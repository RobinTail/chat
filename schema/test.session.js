import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Session = mongoose.model('Session', {
    _id: String,
    session: String,
    expires: Date,
    isTest: Boolean
});

export default Session;
