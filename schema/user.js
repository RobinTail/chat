import mongoose from 'mongoose';

const User = mongoose.model('User', {
    oauthID: Number,
    name: String,
    created: Date,
    provider: String,
    avatar: String,
    sounds: Boolean
});

export default User;
