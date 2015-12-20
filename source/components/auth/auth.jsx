import React from 'react';
import AuthButton from './authButton.jsx';
import './auth.scss';

export default React.createClass({
    render: function() {
        return (
            <div className='authHolder'>
                <AuthButton type='fb' url='/auth/facebook' />
                <AuthButton type='vk' url='/auth/vkontakte' />
                <AuthButton type='tw' url='/auth/twitter' />
                <AuthButton type='gg' url='/auth/google' />
            </div>
        );
    }
});
