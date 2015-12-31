import dispatcher from '../dispatcher/dispatcher';
import {actionTypes} from '../constants/constants';
import EventEmitter from 'events';

const CHANGE_EVENT = 'change';

export default new class ModalStore extends EventEmitter {
    constructor() {
        super();
        this._title = null;
        this._message = null;
        this._show = null;
        this._dispatchToken = dispatcher.register(action => {
            switch (action.type) {
                case actionTypes.MODAL_MESSAGE:
                    this._title = action.title;
                    this._message = action.message;
                    this._show = true;
                    this.emitChange();
                    break;
                case actionTypes.MODAL_HIDE:
                    this._show = false;
                    this.emitChange();
                    break;
            }
        });
    }

    getTitle() {
        return this._title;
    }

    getMessage() {
        return this._message;
    }

    isShow() {
        return this._show;
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
};
