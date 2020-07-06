import { service } from '../../service';
import { errDialog, loading } from '../../utils/util'
const app = getApp();
Page({
    data: {
        userName: '******',
        certStatus: 0,
        merchantName: '',
        msgCount:0,
        merchantStatus:'',
        isHideSwitch:true
    },
    toPath: function(e) {
        var url = e.currentTarget.dataset.url;
        wx.navigateTo({ url: url });
    },
    gocartpage: function() {
      wx.switchTab({url: '/pages/cart/index'})
    },
    onLoad: function() {

    },
    onShow: function() {

    }
});