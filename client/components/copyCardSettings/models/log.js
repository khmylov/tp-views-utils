import $ from 'jquery'
import _ from 'lodash';

export default class Log {
    constructor() {
        this.onLogAppend = $.Callbacks();
    }

    append(arg) {
        const message = _.isString(arg) ? arg : arg.message;
        this.onLogAppend.fire({message});
    }
}