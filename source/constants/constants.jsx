import keymirror from 'keymirror';

export const actionTypes = keymirror({
    GET_LATEST_MESSAGES: null,
    NEW_MESSAGES: null,
    THEY_START_TYPING: null,
    THEY_STOP_TYPING: null,
    MESSAGE_ADDITIONAL_DATA: null,
    MODAL_MESSAGE: null,
    MODAL_HIDE: null
});
