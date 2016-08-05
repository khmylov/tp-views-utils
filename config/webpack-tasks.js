/* eslint no-console: 0 */

const webpack = require('webpack');
const {backendConfig, frontendConfig} = require('./webpack-configs');

function log(...args) {
    console.log.apply(console, ['~webpack:'].concat(...args));
}

function handleWebpackResults(err) {
    if (err) {
        log('Error', err);
    } else {
        log('Task completed');
    }
}

module.exports = {
    log,

    build(callback) {
        webpack([backendConfig, frontendConfig]).run((err, stats) => {
            handleWebpackResults(err, stats);
            if (callback) {
                callback(err);
            }
        });
    },

    watch(completedCallback) {
        var frontendWatcherStarted = false;
        var completedCalled = false;

        const watcherOptions = {
            aggregateTimeout: 300,
            poll: true
        };

        function frontendWatcherCallback(err, stats) {
            log('Frontend watcher callback');
            handleWebpackResults(err, stats);

            if (!completedCalled) {
                completedCalled = true;
                completedCallback();
            }
        }

        function backendWatcherCallback(err, stats) {
            log('Backend watcher callback');
            if (!frontendWatcherStarted) {
                log('Starting frontend watch');
                frontendWatcherStarted = true;
                webpack(frontendConfig).watch(watcherOptions, frontendWatcherCallback);
            }

            handleWebpackResults(err, stats);
        }

        webpack(backendConfig).watch(watcherOptions, backendWatcherCallback);
    }
};