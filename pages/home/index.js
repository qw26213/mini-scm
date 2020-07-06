import { constant } from '../../utils/constant';
import { service } from '../../service';
import { errDialog, loading } from '../../utils/util';
var app = getApp();
Page({
    data: {
        tablist: [{ name: '好吃', page: 'ALL' }, { name: '好玩', page: 'CREATED' }, { name: '好玩', page: 'PAID' }],
        locationCode: '',
        locationName: '',
        productList: [{},{},{},{},{}]
    },
    onLoad: function(options) {
        wx.showShareMenu({ withShareTicket: true })
    },
    toDetail: function(e) {
        var id = 10 // e.currentTarget.dataset.id;
        var storeid = 10 // e.currentTarget.dataset.storeid;
        wx.navigateTo({
            url: '/pages/detail/index?share=0&referer=0&id=' + id + '&storeid=' + storeid
        });
    },
    // 分享
    toComDetailAndShare: function(e) {
        var id = e.currentTarget.dataset.id;
        var storeid = e.currentTarget.dataset.storeid;
        wx.navigateTo({
            url: '/pages/detail/index?share=1&referer=0&id=' + id + '&storeid=' + storeid
        });
    },
    //上拉加载
    onReachBottom:function() {

    },
    //下拉刷新
    onPullDownRefresh:function() {

    }
})