import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Chat = mongoose.model('Chat', {
    userID: {type: Schema.Types.ObjectId, ref: 'User'},
    at: {type: Date, expires: '1h'},
    text: String
});

export default Chat;
