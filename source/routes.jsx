import React from 'react';
import {Router, Route} from 'react-router';
import createHistory from 'history/lib/createBrowserHistory';

import Main from './components/main/main.jsx';

export default (
    <Router history={createHistory()}>
        <Route path='/' component={Main} />
    </Router>
);
