const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const DeepMerge = require('deep-merge');

const globalExclude = /node_modules/;
function ofAppPath(relative) {
    return path.join(path.resolve(__dirname, '..'), relative);
}

function createConfig(overrides) {
    const baseConfig = {
        resolve: {
            extensions: ['', '.js']
        },
        module: {
            loaders: [
                {
                    test: /\.json?$/,
                    loader: 'json-loader',
                    exclude: globalExclude
                },
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    exclude: globalExclude,
                    query: {
                        presets: ['es2015', 'react']
                    }
                }
            ]
        },
        plugins: [
            require('progress-bar-webpack-plugin')({
                format: '  build [:bar] :percent (:elapsed seconds)',
                clear: false
            }),
            new webpack.optimize.OccurenceOrderPlugin()
        ]
    };

    if (process.env.NODE_ENV !== 'production') {
        baseConfig.devtool = '#eval-source-map';
        baseConfig.debug = true;
    } else {
        baseConfig.plugins.push(
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin()
        );
    }

    const merge = DeepMerge((target, source) => {
        return (target instanceof Array) ?
            [].concat(target, source) :
            source;
    });

    return merge(baseConfig, overrides || {});
}

const backendConfig = createConfig({
    entry: ofAppPath('server/server-main.js'),
    target: 'node',
    output: {
        path: ofAppPath('build'),
        filename: 'backend.js'
    },
    node: {
        __dirname: true,
        __filename: true
    },
    plugins: [
        new webpack.BannerPlugin(
            'require("source-map-support").install();',
            {raw: true, entryOnly: false})
    ],
    externals: fs.readdirSync(ofAppPath('node_modules'))
        .filter(x => ['.bin'].indexOf(x) === -1)
        .reduce((acc, mod) => {
            acc[mod] = 'commonjs ' + mod;
            return acc;
        }, {})
});

const frontendConfig = createConfig({
    resolve: {root: [ofAppPath('')]},
    entry: [
        ofAppPath('./client/client-main.js'),
        'bootstrap-loader'
    ],
    output: {
        path: ofAppPath('build/static'),
        filename: 'frontend.js'
    },
    module: {
        loaders: [
            {test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery'},
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
            {
                test: /\.css$/,
                loader: 'style!css'
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            React: 'react'
        })
    ]
});

module.exports = {
    backendConfig,
    frontendConfig
};