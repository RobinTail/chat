import React from 'react';
import Router from 'react-router';
import Reflux from 'reflux';
import AppBar from 'material-ui/lib/app-bar';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MenuItem from 'material-ui/lib/menus/menu-item';
import FontIcon from 'material-ui/lib/font-icon';
import appData from '../appData.jsx';
import Actions from '../actions.jsx';

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
            <AppBar
                style={{marginBottom: 10}}
                title='Chat'
                iconElementLeft={
                    <IconButton onClick={this.handleHomeClick}>
                        <FontIcon className='material-icons'>home</FontIcon>
                    </IconButton>
                }
                iconElementRight={
                    <IconMenu iconButtonElement={
                        <IconButton>
                            <FontIcon className='material-icons'>menu</FontIcon>
                        </IconButton>
                    }>
                        {this.renderSoundsOption()}
                        <MenuItem
                            primaryText='Sign Out'
                            onClick={this.handleSignOut}
                        />
                    </IconMenu>
                }
            />
        );
    },
    renderSoundsOption: function() {
        if (appData.get('isAuthenticated')) {
            return (
                <MenuItem
                    primaryText={'Turn sounds ' +
                    (this.state.sounds ? 'off' : 'on')
                        }
                    onClick={this.handleSounds}
                />
            );
        } else {
            return [];
        }
    },
    handleHomeClick: function() {
        this.history.pushState(null, '/');
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
