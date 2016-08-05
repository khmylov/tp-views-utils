/* eslint no-console: 0 */
const path = require('path');
const nodemon = require('nodemon');
const tasks = require('./webpack-tasks');

const log = tasks.log;
const backendBundlePath = path.join(__dirname, '../build/backend.js');

tasks.watch(
    function onCompleted(err) {
        log('Initial build completed, starting nodemon');

        if (err) {
            log('Initial build completed with error, taking no action');
            return;
        }

        nodemon({
            execMap: {
                js: 'node'
            },
            script: backendBundlePath,
            watch: [backendBundlePath],
            ext: 'noop'
        }).on('restart', () => {
            log('Nodemon restarted');
        });
    }
);