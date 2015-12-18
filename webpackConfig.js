import webpack from 'webpack';

export default {
    entry: ['./source/index.jsx'],
    output: {
        path: __dirname + '/static',
        filename: 'index.js'
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
            }
        ]
    },
    plugins: [
        //new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
};
