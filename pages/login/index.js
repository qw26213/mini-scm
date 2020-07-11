import { constant } from '../../utils/constant'
import { service } from '../../service'
var app = getApp()
Page({
    data: {
        openId: '',
        showPageLoading: true,
        scene: ''
    },
    onLoad: function(options) {
        wx.login({
            success: res => {
                this.login(res.code)
            }
        })
    },
    onHide: function() {
        this.setData({
            showPageLoading: false
        })
    },
    login: function(code) {
        wx.request({
            url: constant.apiUrl + '/drp/mm/enterpriseInfo/login',
            header: { 'content-type': 'application/json', 'code': code, 'appId': constant.APPID },
            method: 'POST',
            success: (res) => {
                if (res.data.errorCode == 0) {
                    wx.setStorageSync('openId', res.data.data.openid)
                    wx.setStorageSync('sessionKey', res.data.data.session_key)
                    wx.reLaunch({ url: '/pages/home/index' })
                } else {
                    console.log('登录失败，错误码:' + res.data.errorCode + ' 返回错误: ' + res.data.msg);
                }
            },
            fail: (err) => {
                console.log(err)
            }
        })
    }
})