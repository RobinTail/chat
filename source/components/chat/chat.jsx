var React = require('react');
var Reflux = require('reflux');
var ChatStore = require('../../stores/chat.jsx');
var Actions = require('../../actions.jsx');
var TextField = require('material-ui/lib/text-field');
var FloatingActionButton = require('material-ui/lib/floating-action-button');
var FontIcon = require('material-ui/lib/font-icon');
var Loading = require('../loading.jsx');
var Message = require('./message.jsx');
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
            isLoaded: false,
            isTyping: false,
            lastTyping: (new Date()).getTime()
        };
    },
    componentWillMount: function() {
        this.request();
    },
    request: function() {
        Actions.getLatestChatMessages();
        var checkLoaded = new Promise(function(resolve, reject) {
            window.setTimeout(function() {
                if (this.state.isLoaded) {
                    resolve();
                } else {
                    reject();
                }
            }.bind(this), 3000);
        }.bind(this));
        checkLoaded.catch(function() {
            console.log('response timeout');
            this.request();
        }.bind(this));
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
            return <Message key={id} {...message} />;
        });
    },
    messageEnterKeyPressed: function() {
        this.sendMessage();
    },
    messageChanged: function(e) {
        if (!this.state.isTyping) {
            Actions.iStartTypingChatMessage();
        }
        this.setState({
            myMessage: e.target.value,
            isTyping: true,
            lastTyping: (new Date()).getTime()
        });
        setTimeout(function() {
            var now = (new Date()).getTime();
            var typingDiff = now - this.state.lastTyping;
            if (typingDiff >= 800 && this.state.isTyping) {
                this.setState({
                    isTyping: false
                });
                Actions.iStopTypingChatMessage();
            }
        }.bind(this), 800);
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
