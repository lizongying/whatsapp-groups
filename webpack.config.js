const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    output: {
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        path: path.join(__dirname, './dist')
    },
    entry: {
        popup: './src/js/popup',
        content: './src/js/content',
        background: './src/js/background',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images'
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            inject: true,
            filename: 'popup.html',
            template: './src/popup.html',
            chunks: ['popup'],
            title: 'Whatsapp Group',
            minify: {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                html5: true,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: true,
                removeAttributeQuotes: true,
                removeComments: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                sortAttributes: true,
                sortClassName: true,
                useShortDoctype: true,
            },
        }),
        new CopyWebpackPlugin([
            {
                from: './src/manifest.json',
                to: path.join(__dirname, './dist/manifest.json'),
            },
        ]),
    ],
};