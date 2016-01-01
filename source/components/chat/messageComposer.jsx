import React from 'react';
import {iStartTyping, iStopTyping, submitMessage} from '../../actions/chatActions';
import './messageComposer.scss';

const TYPING_TIMEOUT = 800;

export default React.createClass({
    getInitialState: function() {
        return {
            myMessage: '',
            isTyping: false,
            lastTyping: (new Date()).getTime()
        };
    },

    render: function() {
        return (
            <div className='send-message-wrapper'>
                {this.renderTypingContainer()}
                <div className='send-message'>
                    <input
                        className='send-message-input'
                        type='text'
                        placeholder='Start typing here'
                        autofocus='autofocus'
                        value={this.state.myMessage}
                        onKeyDown={this._handleKeyPressed}
                        onChange={this._handleChanged}
                        autoComplete='off'
                    />
                    <input
                        className='send-message-button'
                        type='button'
                        onClick={this._sendMessage}
                    />
                </div>
            </div>
        );
    },

    renderTypingContainer: function() {
        // todo: add smooth transition on appear
        if (this.props.typing.length) {
            let verb = this.props.typing.length > 1 ?
                <span>are</span> : <span>is</span>;
            let msg = <span> {verb} typing...</span>;
            let names = null;
            if (this.props.typing.length > 3) {
                names = (
                    <strong>{this.props.typing.length + ' persons'}</strong>
                );
            } else {
                names = this.props.typing.map((user, i) => {
                    return [
                        <strong key={'name_' + i}>{user.name}</strong>,
                        <em key={'sep_' + i}> &amp; </em>
                    ];
                });
                names[names.length - 1].pop();
            }
            return (
                <div className='typing'>
                    {names}
                    {msg}
                </div>
            );
        } else {
            return null;
        }
    },

    _handleKeyPressed: function(e) {
        if (e.keyCode === 13 || e.which === 13) {
            this._sendMessage();
        }
    },

    _handleChanged: function(e) {
        if (!this.state.isTyping) {
            iStartTyping();
        }
        this.setState({
            myMessage: e.target.value,
            isTyping: true,
            lastTyping: (new Date()).getTime()
        });
        setTimeout(() => {
            let now = (new Date()).getTime();
            let typingDiff = now - this.state.lastTyping;
            if (typingDiff >= TYPING_TIMEOUT && this.state.isTyping) {
                this.setState({
                    isTyping: false
                });
                iStopTyping();
            }
        }, TYPING_TIMEOUT);
    },

    _sendMessage: function() {
        if (this.state.myMessage.trim().length > 0) {
            submitMessage(this.state.myMessage);
            this.setState({
                myMessage: ''
            });
        }
    }

});
