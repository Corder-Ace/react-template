const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { getWorkSpacePath } = require('./utils');

module.exports = {
    mode: 'production',
    entry: getWorkSpacePath('src/index.jsx'),
    output: {
        path: getWorkSpacePath('dist/'),
        filename: 'static/js/[name].[chunkhash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.jsx', '.js', '.json'],
        alias: {
            '@components': getWorkSpacePath('src/components'),
            '@pages': getWorkSpacePath('src/pages'),
            '@styles': getWorkSpacePath('src/styles'),
            '@api': getWorkSpacePath('src/api'),
            '@utils': getWorkSpacePath('src/utils'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                enforce: 'pre',
                loader: 'eslint-loader',
            },
            {
                oneOf: [
                    {
                        test: /\.(js|jsx)$/,
                        loader: 'babel-loader',
                        exclude: /node_modules/,
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false,
                        },
                    },
                    {
                        test: /\.css%/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    plugins: () => [autoprefixer({ browsers: 'last 4 versions' })],
                                    sourceMap: true,
                                },
                            },
                        ],
                    },
                    {
                        test: /\.scss$/,
                        exclude: /node_modules/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            {
                                loader: 'postcss-loader',
                                options: {
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        require('postcss-preset-env')(autoprefixer({
                                            browsers: [
                                                '>1%',
                                                'last 2 versions',
                                                'Firefox ESR',
                                                'not ie < 9',
                                            ],
                                            flexbox: 'no-2009',
                                        }))],
                                },
                            },
                            'sass-loader',
                        ],
                    },
                    {
                        test: [/.bmp$/, /.jpe?g$/, /.png$/, /.gif$/],
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'static/images/[name].[hash:8].[ext]',
                        },
                    },
                    {
                        test: [/.bmp$/, /.jpe?g$/, /.png$/, /.gif$/],
                        loader: 'file-loader',
                        options: {
                            name: 'static/images/[name].[hash:8].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        runtimeChunk: {
            name: 'manifest',
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: getWorkSpacePath('public/index.html'),
            favicon: getWorkSpacePath('public/favicon.ico'),
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
        new webpack.DefinePlugin({
            NODE_ENV: process.env.NODE_ENV || 'production',
        }),
        new CopyWebpackPlugin([
            { from: getWorkSpacePath('public/favicon.ico'), to: getWorkSpacePath('dist/') },
        ]),
        new CleanWebpackPlugin(['dist'], {
            root: process.cwd(),
            exclude: ['dll'],
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('../manifest.json'),
        }),
    ],
};
