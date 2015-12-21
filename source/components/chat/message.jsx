import React from 'react';
import FontIcon from 'material-ui/lib/font-icon';
import Avatar from 'material-ui/lib/avatar';
import './message.scss';

export default React.createClass({
    render: function() {
        let avatar = this.props.avatar ? (
            <Avatar
                className='message-avatar'
                src={this.props.avatar}
            />
        ) : (this.props.isSystem ? (
            <Avatar
                className='message-avatar'
                icon={
                    <FontIcon className='material-icons'>
                        settings
                    </FontIcon>}
            />
        ) : (
            <Avatar className='message-avatar'>
                        {this.props.name[0]}
            </Avatar>
        )
        );
        let author = (
            <span key='author' className='message-author'>
                    {this.props.name}
            </span>
        );
        let provider = this.props.provider ? (
            <span key='provider' className='message-author-provider'>
                {this.props.provider}
            </span>
        ) : null;
        let spacer = (
            <span key='spacer'>&nbsp;</span>
        );
        let authorFull = this.props.isMy ?
            [provider, spacer, author] :
            [author, spacer, provider];
        let messageClass = '';
        if (this.props.isSystem) {
            if (this.props.isCritical) {
                messageClass = 'message-system-critical';
            } else {
                messageClass = 'message-system';
            }
        } else if (this.props.isMy) {
            messageClass = 'message-my';
        }
        return (
            <li className={'message ' + messageClass}>
                    {avatar}
                    {authorFull}
                <br />
                <span className='message-text'>{this.props.text}</span>
            </li>
        );
    }
});
