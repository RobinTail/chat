import React from 'react';
import FontIcon from 'material-ui/lib/font-icon';
import Avatar from 'material-ui/lib/avatar';

export default React.createClass({
    render: function() {
        var avatar = this.props.avatar ? (
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
        var author = (
            <span key='author' className='message-author'>
                    {this.props.name}
            </span>
        );
        var provider = this.props.provider ? (
            <span key='provider' className='message-author-provider'>
                {this.props.provider}
            </span>
        ) : null;
        var spacer = (
            <span key='spacer'>&nbsp;</span>
        );
        var authorFull = this.props.isMy ?
            [provider, spacer, author] :
            [author, spacer, provider];
        return (
            <li
                className={this.props.isSystem ?
                    (this.props.isCritical ?
                        'message-system-critical' :
                        'message-system') :
                    (this.props.isMy ? 'message-my' : '')}
            >
                    {avatar}
                    {authorFull}
                <br />
                <span className='message-text'>{this.props.text}</span>
            </li>
        );
    }
});
