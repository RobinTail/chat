import React from 'react';
import Reflux from 'reflux';
import appData from '../../appData.jsx';
import Actions from '../../actions.jsx';
import {version} from '../../../package.json';
import './header.scss';

export default React.createClass({
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
        let url = '/static/images/sound-off.svg';
        if (this.state.sounds) {
            url = '/static/images/sound-on.svg';
        }
        return (
            <img
                src={url}
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
