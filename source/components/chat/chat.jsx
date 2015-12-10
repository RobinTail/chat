var React = require('react');
var Reflux = require('reflux');
var ChatStore = require('../../stores/chat.jsx');
var Actions = require('../../actions.jsx');
var TextField = require('material-ui/lib/text-field');
var FloatingActionButton = require('material-ui/lib/floating-action-button');
var FontIcon = require('material-ui/lib/font-icon');
require('./chat.scss');

module.exports = React.createClass({
    mixins: [
        Reflux.listenTo(ChatStore, 'onChange')
    ],
    getInitialState: function() {
        return {
            myMessage: '',
            messages: []
        };
    },
    componentWillMount: function() {
        Actions.getLatestChatMessages();
    },
    render: function() {
        return (
            <div className='chat-holder'>
                <h1>this is chat</h1>
                {this.renderMessagesContainer()}
                <div className='send-message-holder'>
                    <div className='send-message-subholder'>
                        <div>
                            <div>
                                <TextField className='user-input'
                                    hintText='Your message'
                                    // jscs:disable maximumLineLength
                                    floatingLabelText='Start typing your message here'
                                    // jscs:enable maximumLineLength
                                    value={this.state.myMessage}
                                    onKeyDown={this.messageKeyPressed}
                                    onChange={this.messageChanged}
                                    style={{
                                        width: '100%'
                                    }}
                                />
                            </div>
                            <div>
                                <FloatingActionButton
                                    primary={true}
                                    mini={true}
                                    className='user-send'
                                >
                                    <FontIcon
                                        className='material-icons'
                                        onClick={this.sendMessage}
                                    >
                                        message
                                    </FontIcon>
                                </FloatingActionButton>
                            </div>
                        </div>
                    </div>
                </div>
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
    messageKeyPressed: function(e) {
        if (e.keyCode) {
            this.sendMessage();
        }
    },
    messageChanged: function(e) {
        this.setState({
            myMessage: e.target.value
        });
    },
    sendMessage: function() {

    },
    onChange: function() {
        this.setState({
            messages: ChatStore.messages
        });
    }
});
