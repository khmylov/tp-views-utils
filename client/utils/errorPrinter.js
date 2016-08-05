import _ from 'lodash';

export default {
    getErrorText(e) {
        if (!e) {
            return '<Unknown error>';
        }

        if (_.isString(e)) {
            return e;
        }

        const {message} = e;
        if (_.isString(message)) {
            return message;
        }

        return '<Unknown error>';
    }
};