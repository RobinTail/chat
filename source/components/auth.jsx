import React from 'react';
import AuthFB from './authButtons/auth-fb.jsx';
import AuthTW from './authButtons/auth-tw.jsx';
import AuthGG from './authButtons/auth-gg.jsx';
import AuthVK from './authButtons/auth-vk.jsx';

export default React.createClass({
    render: function() {
        return (
            <div style={{textAlign: 'center'}}>
                <h1>Choose your sign in method</h1>
                <AuthFB />
                &nbsp;
                <AuthTW />
                &nbsp;
                <AuthGG />
                &nbsp;
                <AuthVK />
            </div>
        );
    }
});
