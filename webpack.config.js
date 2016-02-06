var path = require('path');
var fs = require('fs');
var webpack = require('webpack');

// todo: make it better
// taken from http://jlongster.com/Backend-Apps-with-Webpack--Part-I
var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });
    
module.exports = {
    entry: './src/main.js',
    target: 'node',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'backend.js'
    },

    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: path.resolve(__dirname, 'node_modules'),
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },

    externals: nodeModules
};