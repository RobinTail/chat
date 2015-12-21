import React from 'react';
import Router from 'react-router';
import Reflux from 'reflux';
import AppBar from 'material-ui/lib/app-bar';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MenuItem from 'material-ui/lib/menus/menu-item';
import FontIcon from 'material-ui/lib/font-icon';
import appData from '../../appData.jsx';
import Actions from '../../actions.jsx';
import {version} from '../../../package.json';
import './header.scss';

export default React.createClass({
    mixins: [
        Router.History
    ],
    getInitialState: function() {
        return {
            sounds: appData.get('sounds')
        };
    },
    render: function() {
        return (
            <div>
                <div className='appHeader' key='appHeader'>
                    ⧓&nbsp;Robichat
                    <span className='appVersion'>
                            {version}
                    </span>
                </div>
                <div className='appSettingsBar' key='appSettingsBar'>
                    {this.renderSoundsOption()}
                    <img
                        src='/static/images/logout.svg'
                        onClick={this.handleSignOut}
                    />
                </div>
            </div>
        );
    },
    renderSoundsOption: function() {
        // todo: show proper sound icon
        return (
            <img
                src='/static/images/sound-on.svg'
                onClick={this.handleSounds}
            />
        );
    },
    handleSounds: function() {
        appData.set('sounds', !appData.get('sounds'));
        this.setState({
            sounds: appData.get('sounds')
        });
        Actions.setChatSounds(appData.get('sounds'));
    },
    handleSignOut: function() {
        window.location = '/logout';
    }
});
