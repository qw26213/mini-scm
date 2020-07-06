import { constant } from '../../utils/constant';
import { service } from '../../service';
import { errDialog, loading } from '../../utils/util';
var app = getApp();
Page({
    data: {
        locationPcode: '',
        locationCode: '',
        locationName: '',
        slide_image: [{}, {}, {}, {}, {}]
    },
    onLoad: function(options) {
        wx.showShareMenu({ withShareTicket: true })
    },
    toBuy: function(e) {
        var id = 10 // e.currentTarget.dataset.id;
        var storeid = 10 // e.currentTarget.dataset.storeid;
        wx.navigateTo({
            url: '/pages/orderPay/index?share=0&referer=0&id=' + id + '&storeid=' + storeid
        });
    },
    gocartpage: function() {
      wx.switchTab({url: '/pages/cart/index'})
    },
    // 分享
    toShare: function(e) {
        var id = e.currentTarget.dataset.id;
        var storeid = e.currentTarget.dataset.storeid;
        wx.navigateTo({
            url: '/pages/detail/index?share=1&referer=0&id=' + id + '&storeid=' + storeid
        });
    },
    joinBus: function() {
        wx.showToast({
            title: '已加入购物车',
            icon: 'success'
        });
    },
    //上拉加载
    onReachBottom: function() {

    },
    //下拉刷新
    onPullDownRefresh: function() {

    }
})