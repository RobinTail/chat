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
        let at = '';
        if (this.props.at) {
            let d = new Date(this.props.at);
            // todo: format date
            at = d.getHours() + ':' + d.getMinutes();
        }
        let info = (
            <div className='message-info-wrapper'>
                <div className='message-info'>
                    <div className='message-info-author'>{this.props.name}</div>
                    <div className='message-info-at'>{at}</div>
                </div>
            </div>
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
                {info}
                {avatar}
                <div className='message-corner'></div>
                <div className='message-text'>{this.props.text}</div>
            </li>
        );
    }
});
