var React = require('react');
var RaisedButton = require('material-ui/lib/raised-button');
var FontIcon = require('material-ui/lib/font-icon');

module.exports = React.createClass({
    render: function() {
        return (
            <RaisedButton linkButton={true} href='/auth/facebook' label='Facebook'>
            </RaisedButton>
        );
    }
});
