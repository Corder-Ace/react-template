const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { getWorkSpacePath } = require('./utils');

module.exports = {
    mode: 'development',
    entry: getWorkSpacePath('src/index.jsx'),
    output: {
        path: getWorkSpacePath('dist/'),
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js',
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
                        use: ['style-loader', 'css-loader'],
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            'style-loader',
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
    plugins: [
        new htmlWebpackPlugin({
            inject: true,
            template: getWorkSpacePath('public/index.html'),
        }),
        new webpack.DefinePlugin({
            NODE_ENV: process.env.NODE_ENV || 'development',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        host: 'localhost',
        port: 3000,
        inline: true,
        contentBase: getWorkSpacePath('dist/'),
        watchContentBase: true,
        historyApiFallback: true,
        hot: true,
        overlay: {
            errors: true,
        },
        stats: 'errors-only',
        compress: true,
    },
};
