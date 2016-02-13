/* eslint no-console: 0 */

const _ = require('lodash');
const webpack = require('webpack');
const webpackConfigs = require('./webpack-configs');
const backendConfig = webpackConfigs.backendConfig;
const frontendConfig = webpackConfigs.frontendConfig;

function log() {
    console.log.apply(console, ['~webpack:'].concat(_.toArray(arguments)));
}

function handleWebpackResults(err) {
    if (err) {
        log('Error', err);
    } else {
        log('Task completed');
    }
}

module.exports = {
    build(callback) {
        webpack([backendConfig, frontendConfig]).run((err, stats) => {
            handleWebpackResults(err, stats);
            if (callback) {
                callback(err);
            }
        });
    },

    watch(completedCallback, restartCallback) {
        var frontendWatcherStarted = false;
        var completedCalled = false;

        const backendCompiler = webpack(backendConfig);
        backendCompiler.watch({}, (err, stats) => {
            log('Backend callback');
            if (!frontendWatcherStarted) {
                log('Starting frontend watch');
                frontendWatcherStarted = true;
                webpack(frontendConfig).watch({}, (err, stats) => {
                    log('Frontend callback');
                    handleWebpackResults(err, stats);

                    if (!completedCalled) {
                        completedCalled = true;
                        completedCallback();
                    }
                });
            }

            handleWebpackResults(err, stats);
            restartCallback();
        });
    }
};