import Reflux from 'reflux';

export default Reflux.createActions([
    // Modal Store
    'updateModal',

    // Chat Store

    // connection events
    'afterChatConnected',
    'afterChatConnectionLost',

    // incoming messages events
    'getLatestChatMessages',
    'afterLatestChatMessages',
    'newChatMessages',
    'fetchEmbedIntoChatMessages',

    // broadcasting events
    'submitChatMessage',
    'iStartTypingChatMessage',
    'iStopTypingChatMessage',
    'theyStartTypingChatMessage',
    'theyStopTypingChatMessage',

    // additional events
    'setChatSounds'
]);
