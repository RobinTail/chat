var React = require('react');
var Reflux = require('reflux');
var ChatStore = require('../stores/chat.jsx');
var Actions = require('../actions.jsx');

module.exports = React.createClass({
    mixins: [
        Reflux.listenTo(ChatStore, 'onChange')
    ],
    getInitialState: function() {
        return {
            messages: []
        };
    },
    componentWillMount: function() {
        Actions.getLatestChatMessages();
    },
    render: function() {
        return (
            <div>
                <h1>this is chat</h1>
                {this.renderMessagesContainer()}
            </div>
        );
    },
    renderMessagesContainer: function() {
        return (
            <ul>
                {this.renderMessages()}
            </ul>
        );
    },
    renderMessages: function() {
        return this.state.messages.map(function(message, id) {
            return (
                <li key={id}>
                    {message.text}
                </li>
            );
        });
    },
    onChange: function() {
        this.setState({
            messages: ChatStore.messages
        });
    }
});
