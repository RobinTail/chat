import Dispatcher from '../dispatcher/dispatcher';
import {actionTypes} from '../constants/constants';

export function modalMessage(title, message) {
    Dispatcher.dispatch({
        type: actionTypes.MODAL_MESSAGE,
        title: title,
        message: message
    });
}

export function modalHide() {
    Dispatcher.dispatch({
        type: actionTypes.MODAL_HIDE
    });
}
