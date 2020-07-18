import { constant } from '../../utils/constant'
import { service } from '../../service'
var app = getApp()
Page({
    data: {
        openId: '',
        showPageLoading: true,
        referer: 0,
        shareCode: '',
        goodId: '',
        scene: ''
    },
    onLoad: function(options) {
        console.log('login page------------')
        console.log(options)
        if (options.referer) {
            this.setData({ referer: options.referer })
            this.setData({ shareCode: options.shareCode })
            console.log('shareCode=' + this.data.shareCode)
        }
        if (this.data.referer == 2) {
            this.setData({ goodId: options.id })
        }
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
        console.log('excute login------------')
        wx.request({
            url: constant.apiUrl + '/drp/mm/customer/login',
            header: { 'content-type': 'application/json', code: code, appId: constant.APPID, test: 1, shareCode: this.data.shareCode },
            method: 'POST',
            success: (res) => {
                if (res.data.errorCode == 0) {
                    wx.setStorageSync('openId', res.data.data.openId)
                    this.setData({ openId: res.data.data.openId })
                    wx.setStorageSync('sessionKey', res.data.data.sessionKey)
                    this.getMyInfo()
                } else {
                    console.log('登录失败，错误码:' + res.data.errorCode + ' 返回错误: ' + res.data.msg);
                }
            },
            fail: (err) => {
                console.log(err)
            }
        })
    },
    getMyInfo: function() {
        console.log('excute userInfo------------')
        service.getByOpenId({ openId: this.data.openId }).subscribe({
            next: res => {
                if (!res) {
                    wx.reLaunch({ url: '/pages/getuser/index' })
                } else {
                    wx.setStorageSync('shareCode', res.myShareCode)
                    this.nextPage()
                }
            },
            error: err => {},
            complete: () => wx.hideToast()
        })
    },
    nextPage: function() {
        if (this.data.referer == 2) {
            wx.reLaunch({ url: '/pages/detail/index?id=' + this.data.goodId })
        } else {
            wx.reLaunch({ url: '/pages/home/index' })
        }
    }
})