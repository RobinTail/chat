import keymirror from 'keymirror';

export default {
    ActionTypes: keymirror({
        CONNECTED: null,
        CONNECTION_LOST: null,
        REQUEST_LAST_MESSAGES: null,
        LAST_MESSAGES: null,
        NEW_MESSAGES: null,
        REQUEST_EMBEDLY: null,
        SUBMIT_MESSAGE: null,
        I_START_TYPING: null,
        I_STOP_TYPING: null,
        THEY_START_TYPING: null,
        THEY_STOP_TYPING: null,
        SET_SOUNDS: null,
        MODAL_MESSAGE: null
    })
};
