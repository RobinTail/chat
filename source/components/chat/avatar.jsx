import React from 'react';
import './avatar.scss';

export default React.createClass({
    render: function() {
        return (
            <div
                className='avatar'
                style={{
                    backgroundImage: this.props.url ?
                        ('url("' + this.props.url + '")') : 'none'
                }}
            >
                {this.renderProvider()}
            </div>
        );
    },
    renderProvider() {
        if (!this.props.provider) { return null; }
        let check = this.props.provider;
        let providerClass = '';
        if (check === 'facebook') {
            providerClass = 'fb';
        } else if (check === 'vkontakte') {
            providerClass = 'vk';
        } else if (check === 'twitter') {
            providerClass = 'tw';
        } else if (check === 'google') {
            providerClass = 'gg';
        }
        if (!providerClass) { return null; }
        return (
            <div className={'provider ' + providerClass}></div>
        );
    }
});
