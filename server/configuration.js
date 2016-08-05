import nconfImport from 'nconf';
export const nconf = nconfImport;

nconf
    .env(['NODE_ENV', 'PORT', 'SESSION_SECRET'])
    .file('user', {
        file: 'app.config.private.json'
    })
    .file('global', {
        file: 'app.config.json'
    })
    .defaults({
        PORT: 3000,
        SESSION_SECRET: 'tp-views-utils-default-session-secret'
    });

export const isProduction = nconf.get('NODE_ENV') === 'production';