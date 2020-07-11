import xs from '../lib/xstream/index';
import { constant } from 'constant';
import { errDialog, loading } from 'util'

let http = {}

http.get = (url, data = {}) => {
    for (let objName in data) {
        if (data[objName] === undefined || data[objName] === 'undefined') {
            data[objName] = ''
        }
    }
    return http_request(url, 'GET', data);
}

http.post = (url, data = {}) => {
    for (let objName in data) {
        if (data[objName] === undefined || data[objName] === 'undefined') {
            data[objName] = ''
        }
    }
    return http_request(url, 'POST', data);
}

function http_request(url, method, data) {
    const producer = {
        start: listener => {
            wx.request({
                url: url,
                data: data,
                header: { 'content-type': 'application/json', 'sessionKey': wx.getStorageSync('sessionKey'), 'appId': constant.APPID },
                method: method,
                success: res => {
                    if (res.data.errorCode === '0') {
                        return listener.next(res.data.data);
                    } else {
                        return listener.error(res.data.msg);
                    }
                },
                fail: res => listener.error(res.errMsg),
                complete: () => listener.complete()
            })
        },
        stop: () => {}
    }
    return xs.create(producer)
}

module.exports = {
    http: http
}