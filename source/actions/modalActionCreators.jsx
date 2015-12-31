import Dispatcher from '../dispatcher/dispatcher';
import {actionTypes} from '../constants/constants';

export default {
    modalMessage: function(title, message) {
        Dispatcher.dispatch({
            type: actionTypes.MODAL_MESSAGE,
            title: title,
            message: message
        });
    },

    modalHide: function() {
        Dispatcher.dispatch({
            type: actionTypes.MODAL_HIDE
        });
    }
};
