var React = require('react');
var Header = require('./header.jsx');
var Modal = require('./modal.jsx');
var Auth = require('./auth.jsx');

var injectTapEventPlugin = require('react-tap-event-plugin');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var Theme = require('../material-ui-theme.jsx');

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

module.exports = React.createClass({
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
                <Header />
                {this.content()}
                <Modal />
            </div>
        );
    },
    content: function() {
        if (this.props.children) {
            return this.props.children;
        } else {
            return <Auth />;
        }
    }
});
