/* eslint no-console: 0 */
const path = require('path');
const _ = require('lodash');
const nodemon = require('nodemon');
const tasks = require('./webpack-tasks');

function log() {
    console.log.apply(console, ['~webpack:'].concat(_.toArray(arguments)));
}

tasks.watch(
    function onCompleted(err) {
        log('Initial build completed, starting nodemon');

        if (!err) {
            nodemon({
                execMap: {
                    js: 'node'
                },
                script: path.join(__dirname, '../build/backend.js'),
                ignore: ['*'],
                watch: ['__ignored__/'],
                ext: 'noop'
            }).on('restart', () => {
                log('Nodemon restarted');
            });
        }
    },
    function onRestarted() {
        nodemon.restart();
    }
);