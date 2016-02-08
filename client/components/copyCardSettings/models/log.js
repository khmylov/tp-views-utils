import $ from 'jquery'

export default class Log {
    constructor() {
        this.onLogAppend = $.Callbacks();
    }

    append({message}) {
        this.onLogAppend({message});
    }
}