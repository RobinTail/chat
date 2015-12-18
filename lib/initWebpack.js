import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import config from '../webpack.config.js';
import myconsole from './console';

export default function(app) {
    if (process.env.NODE_ENV !== 'production') {
        myconsole.log('Using webpack dev middleware');
        var webpackCompiler = webpack(config);
        app.use(webpackDevMiddleware(webpackCompiler, {
            noInfo: true,
            publicPath: '/static/'
        }));
    } else {
        myconsole.log('Using webpack build');
    }
};
