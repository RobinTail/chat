import React from 'react';
import FontIcon from 'material-ui/lib/font-icon';
/*import Avatar from 'material-ui/lib/avatar';*/
import Avatar from './avatar';
import './message.scss';

export default React.createClass({
    render: function() {
        let avatar = (
            <Avatar
                url={this.props.avatar}
                provider={this.props.provider}
            />
        );
        let author = (
            <span key='author' className='message-author'>
                    {this.props.name}
            </span>
        );
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
                <div className='message-corner'></div>
                <div className='message-text'>{this.props.text}</div>
            </li>
        );
    }
});
