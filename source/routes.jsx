var React = require('react');
var ReactRouter = require('react-router');
import createHistory from 'history/lib/createBrowserHistory';

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;

var Main = require('./components/main/main.jsx');

module.exports = (
    <Router history={createHistory()}>
        <Route path='/' component={Main} />
    </Router>
);
