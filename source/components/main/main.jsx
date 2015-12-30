import React from 'react';
import Header from '../header/header';
import Modal from '../modal/modal';
import Auth from '../auth/auth';
import Chat from '../chat/chat';
import appData from '../../appData';

import injectTapEventPlugin from 'react-tap-event-plugin';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import Theme from '../../material-ui-theme';

import './main.scss';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

export default React.createClass({
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },
    getChildContext() {
        return {
            muiTheme: ThemeManager.getMuiTheme(Theme)
        };
    },
    render: function() {
        return (
            <div>
                {this.content()}
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
