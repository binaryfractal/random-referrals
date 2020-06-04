const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        scripts: ['@babel/polyfill', './src/scripts/index.js']
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'scripts.bundle.js'
    },
    devServer: {
        port: 4000
    },
    module: {
        rules: [{
            test: /\.js/,
            use: ['babel-loader']
        },
        {
            test: /\.css/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
            test: /\.(png|svg|jpg|gif|ttf)$/,
            use: ['file-loader'],
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.bundle.css'
        })
    ]
}