var nconf = require('nconf');

nconf
    .env(['NODE_ENV', 'PORT', 'SESSION_SECRET'])
    .file({
        file: 'app.config.json'
    })
    .defaults({
        PORT: 3000,
        SESSION_SECRET: 'tp-views-utils-default-session-secret'
    });

module.exports = {
    nconf
};