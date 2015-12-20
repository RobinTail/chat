import React from 'react';
import AuthButton from './authButton.jsx';
import './auth.scss';

export default React.createClass({
    render: function() {
        return (
            <div className='authHolder'>
                <div className='authWelcome'>
                    <div>
                        <h2>Welcome to Robichat</h2>
                        <h1>Let's get closer</h1>
                    </div>
                </div>
                <div className='authButtonsHolder'>
                    <AuthButton type='fb' url='/auth/facebook' />
                    <AuthButton type='vk' url='/auth/vkontakte' />
                    <AuthButton type='tw' url='/auth/twitter' />
                    <AuthButton type='gg' url='/auth/google' />
                </div>
            </div>
        );
    }
});
