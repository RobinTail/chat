import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/main/main';
import appData from './appData';
import modalActionCreators from './actions/modalActionCreators';

if (appData.get('error') === true) {
    modalActionCreators.modalMessage('Error occured', 'Message: ' + appData.get('data').message);
}

ReactDOM.render(<Main />, document.getElementById('AppContainer'));
