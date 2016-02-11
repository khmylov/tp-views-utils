import $ from 'jquery'

class Api {
    constructor() {

    }

    doRequest(url, {type = 'GET', data = null} = {}) {
        const fullUrl = `/api` + url;
        return $.ajax({
            url: fullUrl,
            type: type,
            data: data != null ? JSON.stringify(data) : null,
            contentType: 'application/json',
            dataType: 'json'
        })
    }
}

export default Api;