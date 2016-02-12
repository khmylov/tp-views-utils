import _ from 'lodash';

export default {
    notNull(value, argumentName) {
        if (!value) {
            throw new Error(`'${argumentName}' should be a not null-like value`);
        }

        return value;
    },

    notEmptyString(s, argumentName) {
        if (!_.isString(s) || !s.length) {
            throw new Error(`'${argumentName}' should be a non-empty string`);
        }

        return s;
    }
}