import {constant} from 'utils/constant';
import {errDialog,loading} from 'utils/util';
import {service} from 'service';
import {ToastPannel} from 'components/toast/toast.js';
App({
    ToastPannel,
    onLaunch: function(options) {
        wx.showShareMenu({
            withShareTicket: true
        });
        console.log('app');
        console.log(options);
        wx.setStorageSync('scene', options.scene);
        if (options.shareTicket) {
            wx.getShareInfo({
                shareTicket: options.shareTicket,
                success: function(res) {
                    console.log(res)
                }
            });
        }
    },
    onHide: function() {
        console.log('App Hide')
    },
    onShow: function(options) {
        // wx.setStorageSync('scene', options.scene);
        // const updateManager = wx.getUpdateManager();
        // updateManager.onCheckForUpdate(function(res) {
        //     console.log("版本更新是否完成===="+res.hasUpdate)
        // })
    },
    globalData: {
        locationName: null,
        userInfo: null,
        rawData: null,
        iv: null,
        signature: null,
        share: false,// 分享默认为false
        barHeight:0,
        screenHeight:0
    }
})