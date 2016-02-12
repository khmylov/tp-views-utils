import $ from 'jquery';
import _ from 'lodash';

/**
 * @class Log
 */
export default class Log {
    constructor() {
        this.onLogAppend = $.Callbacks();
    }

    append(arg) {
        const message = _.isString(arg) ? arg : arg.message;
        this.onLogAppend.fire({message});
    }
}