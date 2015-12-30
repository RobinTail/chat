import React from 'react';
import Header from '../header/header';
import Modal from '../modal/modal';
import Auth from '../auth/auth';
import Chat from '../chat/chat';
import appData from '../../appData';
import Actions from '../../actions';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './main.scss';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

export default React.createClass({
    componentWillMount: function() {
        if (appData.get('error') === true) {
            Actions.updateModal('Error occured', 'Message: ' + appData.get('data').message);
        }
    },
    render: function() {
        return (
            <div>
                {this.content()}
                <Modal />
            </div>
        );
    },
    content: function() {
        if (appData.get('isAuthenticated')) {
            return (
                <div id='Wrapper'>
                    <div id='fakedBody'></div>
                    <Header />
                    <Chat />
                </div>
            );
        } else {
            return <Auth />;
        }
    }
});
