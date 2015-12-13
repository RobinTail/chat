module.exports = function(app) {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Using webpack dev middleware');
        var webpack = require('webpack');
        var webpackDevMiddleware = require('webpack-dev-middleware');
        var webpackCompiler = webpack(require('../webpack.config.js'));
        app.use(webpackDevMiddleware(webpackCompiler, {
            noInfo: true,
            publicPath: '../static/'
        }));
    } else {
        console.log('Using webpack build');
    }
};
