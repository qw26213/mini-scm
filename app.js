import { constant } from 'utils/constant';
import { errDialog, loading } from 'utils/util';
import { service } from 'service';
import { ToastPannel } from 'components/toast/toast.js';
App({
    ToastPannel,
    onLaunch: function(options) {

    },

    onShow: function(options) {
        // wx.setStorageSync('scene', options.scene);
        // const updateManager = wx.getUpdateManager();
        // updateManager.onCheckForUpdate(function(res) {
        //     console.log("版本更新是否完成===="+res.hasUpdate)
        // })
    },
    globalData: {
        userInfo: null
    }
})