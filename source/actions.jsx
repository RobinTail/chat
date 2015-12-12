var Reflux = require('reflux');

module.exports = Reflux.createActions([
    'updateModal',
    'getLatestChatMessages',
    'submitChatMessage',
    'iStartTypingChatMessage',
    'iStopTypingChatMessage'
]);
