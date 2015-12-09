var React = require('react');
var AuthFB = require('./authButtons/auth-fb.jsx');

module.exports = React.createClass({
    render: function() {
        return (
            <div>
                <AuthFB />
            </div>
        );
    }
});
