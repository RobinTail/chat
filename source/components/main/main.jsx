import React from 'react';
import Header from '../header/header.jsx';
import Modal from '../modal.jsx';
import Auth from '../auth/auth.jsx';
import Chat from '../chat/chat.jsx';
import appData from '../../appData.jsx';

import injectTapEventPlugin from 'react-tap-event-plugin';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import Theme from '../../material-ui-theme.jsx';

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
                <Modal />
            </div>
        );
    },
    content: function() {
        if (this.props.children) {
            return this.props.children;
        } else {
            if (appData.get('isAuthenticated')) {
                return [
                    <Header key='header' />,
                    <Chat key='chat' />
                ];
            } else {
                return <Auth />;
            }
        }
    }
});
