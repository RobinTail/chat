import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Message = mongoose.model('Message', {
    author: {
        id: {type: Schema.Types.ObjectId},
        name: {type: String},
        provider: {type: String},
        avatar: {type: String}
    },
    at: {type: Date, expires: '1h'},
    text: String
});

export default Message;
