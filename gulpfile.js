var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var nodemon = require('nodemon');
var DeepMerge = require('deep-merge');

var deepmerge = DeepMerge(function(target, source, key) {
    if(target instanceof Array) {
        return [].concat(target, source);
    }
    return source;
});

const globalExclude = /node_modules/;

// generic

var defaultConfig = {
    resolve: { extensions: [ '', '.js' ] },
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
    }
};

if(process.env.NODE_ENV !== 'production') {
    defaultConfig.devtool = '#eval-source-map';
    defaultConfig.debug = true;
}

function config(overrides) {
    return deepmerge(defaultConfig, overrides || {});
}

// frontend

var frontendConfig = config({
    entry: ['./client/client-main.js', 'bootstrap-loader'],
    output: {
        path: path.join(__dirname, 'build/static'),
        filename: 'frontend.js'
    },
    module: {
        loaders: [
            { test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery' },
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
            {
                test: /\.css$/,
                loader: 'style!css'
            }
        ]
    }
});

// backend

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

var backendConfig = config({
    entry: './server/server-main.js',
    target: 'node',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'backend.js'
    },
    node: {
        __dirname: true,
        __filename: true
    },

    externals: nodeModules,

    plugins: [
        new webpack.BannerPlugin(
            'require("source-map-support").install();',
            { raw: true, entryOnly: false })
    ]
});

// tasks

function onBuild(done) {
    return function(err, stats) {
        if(err) {
            console.log('Error', err);
        }
        else {
            console.log(stats.toString());
        }

        if(done) {
            done();
        }
    }
}

gulp.task('frontend-build', function(done) {
    webpack(frontendConfig).run(onBuild(done));
});

gulp.task('frontend-watch', function() {
    webpack(frontendConfig).watch(100, onBuild());
});

gulp.task('backend-build', function(done) {
    webpack(backendConfig).run(onBuild(done));
});

gulp.task('backend-watch', function() {
    webpack(backendConfig).watch(100, function(err, stats) {
        onBuild()(err, stats);
        nodemon.restart();
    });
});


gulp.task('build', ['frontend-build', 'backend-build']);
gulp.task('watch', ['frontend-watch', 'backend-watch']);

gulp.task('run', ['backend-watch', 'frontend-watch'], function() {
    nodemon({
        execMap: {
            js: 'node'
        },
        script: path.join(__dirname, 'build/backend'),
        ignore: ['*'],
        watch: ['__ignore/'],
        ext: 'noop'
    }).on('restart', function() {
        console.log('Restarted!');
    });
});