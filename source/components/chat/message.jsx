import React from 'react';
import Avatar from './avatar';
import Embed from './embed';
import moment from 'moment';
import './message.scss';

export default React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
        // todo: check only params: isEmbed, isSameAuthor (?)
        let nextKeys = Object.keys(nextProps);
        let keys = nextKeys.concat(
                Object.keys(this.props).filter(item => {
                    return nextKeys.indexOf(item) === -1;
                }
            ));
        return !(keys.every(k => {
            return nextProps[k] === this.props[k];
        }));
    },
    render: function() {
        let avatar = this.props.isSameAuthor ? (
            <div className='message-same-author-placeholder'></div>
        ) : (
            <Avatar
                url={this.props.avatar}
                provider={this.props.provider}
            />
        );
        let at = '';
        if (this.props.at) {
            at = moment(this.props.at).format('HH:mm');
        }
        let info = this.props.isSameAuthor ? null : (
            <div className='message-info-wrapper'>
                <div className='message-info'>
                    <div className='message-info-author'>{this.props.name}</div>
                    <div className='message-info-at'>{at}</div>
                </div>
            </div>
        );
        let corner = this.props.isSameAuthor ? null : (
            <div className='message-corner'></div>
        );
        let messageClass = '';
        if (this.props.isSystem) {
            if (this.props.isCritical) {
                messageClass = 'message-system-critical';
            } else if (this.props.isWarning) {
                messageClass = 'message-system-warning';
            } else {
                messageClass = 'message-system';
            }
        } else if (this.props.isMy) {
            messageClass = 'message-my';
        }
        let text = <div className='message-text'>{this.props.text}</div>;
        if (this.props.isParsed) {
            text = [(
                <div key='text' className='message-text'>
                    <div
                        dangerouslySetInnerHTML={{__html: this.props.html}}
                    ></div>
                </div>
            ), <Embed key='embed' data={this.props.embed} />];
        }
        return (
            <li className={'message ' + messageClass}>
                {info}
                {avatar}
                {corner}
                {text}
            </li>
        );
    }
});
