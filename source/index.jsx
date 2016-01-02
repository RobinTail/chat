/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import ReactDOM from 'react-dom';
import Main from './components/main/main';
import appData from './appData';
import {modalMessage} from './actions/modalActions';
import {initChat} from './actions/chatActions';

if (appData.get('error') === true) {
    modalMessage('Error occured', 'Message: ' + appData.get('data').message);
} else if (appData.get('isAuthenticated')) {
    initChat();
}

ReactDOM.render(<Main />, document.getElementById('AppContainer'));
