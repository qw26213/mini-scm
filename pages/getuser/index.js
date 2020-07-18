import { constant } from '../../utils/constant'
import { service } from '../../service'
import { errDialog, loading } from '../../utils/util';
var app = getApp()
Page({
    data: {},
    getUserInfo: function(e) {
        app.globalData.userInfo = e.detail.userInfo
        const obj = e.detail.userInfo
        loading()
        service.saveUser(obj).subscribe({
            next: res => {
	            wx.showToast({
	                title: '登录成功',
	                icon: 'none'
	            })
                wx.setStorageSync('shareCode', res.myShareCode)
		        wx.reLaunch({ url: '/pages/home/index' })
            },
            error: err => errDialog(err),
            complete: () => wx.hideToast()
        })
    }
})