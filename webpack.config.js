var webpack = require('webpack');

module.exports = {
    entry: ['./source/index.jsx'],
    output: {
        path: __dirname + '/static',
        filename: 'index.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: process.env.NODE_ENV !== 'production' ? [] :
        [
            new webpack.optimize.UglifyJsPlugin({
                minimize: true
            })
        ]
};
