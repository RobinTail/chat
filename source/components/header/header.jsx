import React from 'react';
import Reflux from 'reflux';
import appData from '../../appData';
import Actions from '../../actions';
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
                    <div
                        className='signOutBtn'
                        onClick={this._handleSignOut}>
                    </div>
                </div>
            </div>
        );
    },
    renderSoundsOption: function() {
        return (
            <div className={'soundBtn' + (this.state.sounds ? ' _on' : '')}
                onClick={this._handleSounds}>
            </div>
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
