var React = require('react');
var Reflux = require('reflux');
var ChatStore = require('../../stores/chat.jsx');
var Actions = require('../../actions.jsx');
var TextField = require('material-ui/lib/text-field');
var FloatingActionButton = require('material-ui/lib/floating-action-button');
var FontIcon = require('material-ui/lib/font-icon');
var Avatar = require('material-ui/lib/avatar');
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
                                <TextField className='my-message'
                                    hintText='Your message'
                                    // jscs:disable maximumLineLength
                                    floatingLabelText='Start typing your message here'
                                    // jscs:enable maximumLineLength
                                    value={this.state.myMessage}
                                    onKeyDown={this.messageKeyPressed}
                                    onChange={this.messageChanged}
                                    fullWidth={true}
                                />
                            </div>
                            <div>
                                <FloatingActionButton
                                    primary={true}
                                    mini={true}
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
            <ul className='messages-holder'>
                {this.renderMessages()}
            </ul>
        );
    },
    renderMessages: function() {
        return this.state.messages.map(function(message, id) {
            return (
                <li
                    key={id}
                    className={message.isSystem ?
                        (message.isCritical ?
                            'message-system-critical' :
                            'message-system') :
                        (message.isMy ? 'message-my' : '')}
                >
                    <Avatar className='message-avatar'>
                        {message.name[0]}
                    </Avatar>
                    <span className='message-author'>{message.name}</span>
                    <br />
                    <span className='message-text'>{message.text}</span>
                </li>
            );
        });
    },
    messageKeyPressed: function(e) {
        if (e.keyCode === 13) {
            this.sendMessage();
        }
    },
    messageChanged: function(e) {
        this.setState({
            myMessage: e.target.value
        });
    },
    sendMessage: function() {
        Actions.submitChatMessage(this.state.myMessage);
        this.setState({
            myMessage: ''
        });
    },
    onChange: function() {
        this.setState({
            messages: ChatStore.messages
        });
        window.scrollTo(0, document.body.scrollHeight);
    }
});
