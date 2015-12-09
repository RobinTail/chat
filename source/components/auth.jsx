var React = require('react');
var AuthFB = require('./authButtons/auth-fb.jsx');
var AuthTW = require('./authButtons/auth-tw.jsx');
var AuthGG = require('./authButtons/auth-gg.jsx');
var AuthVK = require('./authButtons/auth-vk.jsx');

module.exports = React.createClass({
    render: function() {
        return (
            <div style={{textAlign: 'center'}}>
                <h1>Choose your login method</h1>
                <AuthFB />
                &nbsp;
                <AuthTW />
                &nbsp;
                <AuthGG />
                &nbsp;
                <AuthVK />
            </div>
        );
    }
});
