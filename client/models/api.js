import $ from 'jquery'

class Api {
    constructor() {

    }

    doRequest(url, type = 'GET', data = null) {
        const fullUrl = `/api` + url;
        return $.ajax({
            url: fullUrl,
            type: type,
            data: data,
            dataType: 'JSON'
        })
    }
}

export default Api;