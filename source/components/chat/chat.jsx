var React = require('react');
var Reflux = require('reflux');
var ChatStore = require('../../stores/chat.jsx');
var Actions = require('../../actions.jsx');
var TextField = require('material-ui/lib/text-field');
var FloatingActionButton = require('material-ui/lib/floating-action-button');
var FontIcon = require('material-ui/lib/font-icon');
var Avatar = require('material-ui/lib/avatar');
var Loading = require('../loading.jsx');
var smoothscroll = require('smoothscroll');
require('./chat.scss');

module.exports = React.createClass({
    mixins: [
        Reflux.listenTo(ChatStore, 'onChange')
    ],
    getInitialState: function() {
        return {
            myMessage: '',
            messages: [],
            isLoaded: false
        };
    },
    componentWillMount: function() {
        Actions.getLatestChatMessages();
    },
    render: function() {
        return (
            <div className='chat-holder'>
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
                                    onEnterKeyDown={this.messageEnterKeyPressed}
                                    onChange={this.messageChanged}
                                    fullWidth={true}
                                    autoComplete='off'
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
        if (this.state.isLoaded) {
            if (this.state.messages.length) {
                return (
                    <ul className='messages-holder'>
                        {this.renderMessages()}
                    </ul>
                );
            } else {
                return (
                    <h4><em>
                        No messages yet. Write your first one :)
                    </em></h4>
                );
            }
        } else {
            return <Loading />;
        }

    },
    renderMessages: function() {
        return this.state.messages.map(function(message, id) {
            var avatar = message.avatar ? (
                <Avatar
                    className='message-avatar'
                    src={message.avatar}
                />
            ) : (
                <Avatar className='message-avatar'>
                    {message.name[0]}
                </Avatar>
            );
            var author = (
                <span key='author' className='message-author'>{message.name}</span>
            );
            var provider = message.provider ? (
                <span key='provider' className='message-author-provider'>
                    ({message.provider})
                </span>
            ) : null;
            var spacer = (
                <span key='spacer'>&nbsp;</span>
            );
            var authorFull = message.isMy ?
                [provider, spacer, author] :
                [author, spacer, provider];
            return (
                <li
                    key={id}
                    className={message.isSystem ?
                        (message.isCritical ?
                            'message-system-critical' :
                            'message-system') :
                        (message.isMy ? 'message-my' : '')}
                >
                    {avatar}
                    {authorFull}
                    <br />
                    <span className='message-text'>{message.text}</span>
                </li>
            );
        });
    },
    messageEnterKeyPressed: function() {
        this.sendMessage();
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
            messages: ChatStore.messages,
            isLoaded: true
        });
        smoothscroll(document.body.scrollHeight);
    }
});
