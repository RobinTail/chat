var React = require('react');
var Router = require('react-router');
var Reflux = require('reflux');
var AppBar = require('material-ui/lib/app-bar');
var IconMenu = require('material-ui/lib/menus/icon-menu');
var IconButton = require('material-ui/lib/icon-button');
var MenuItem = require('material-ui/lib/menus/menu-item');
var FontIcon = require('material-ui/lib/font-icon');

module.exports = React.createClass({
    mixins: [
        Router.History
    ],
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
                        <MenuItem primaryText='Sign Out' onClick={this.handleSignOut} />
                    </IconMenu>
                }
            />
        );
    },
    handleHomeClick: function() {
        this.history.pushState(null, '/');
    },
    handleSignOut: function() {
        window.location = '/logout';
    }
});
