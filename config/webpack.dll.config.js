const webpack = require('webpack');
const path = require('path');
const { getWorkSpacePath } = require('./utils');

const vendor = [
    'react',
    'react-dom',
    'react-router-dom',
    'redux',
    'react-redux',
    'redux-thunk',
    'axios',
];

module.exports = {
    entry: {
        dll: vendor,
    },
    output: {
        path: getWorkSpacePath('dist/dll'),
        filename: '[name].dll.js',
        library: '_dll_[name]',
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]',
            path: getWorkSpacePath('manifest.json'),
        }),
    ],
};
