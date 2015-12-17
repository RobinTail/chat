const myconsole = require('./console');

module.exports = function(app) {
    if (process.env.NODE_ENV !== 'production') {
        myconsole.log('Using webpack dev middleware');
        var webpack = require('webpack');
        var webpackDevMiddleware = require('webpack-dev-middleware');
        var webpackCompiler = webpack(require('../webpack.config.js'));
        app.use(webpackDevMiddleware(webpackCompiler, {
            noInfo: true,
            publicPath: '/static/'
        }));
    } else {
        myconsole.log('Using webpack build');
    }
};
