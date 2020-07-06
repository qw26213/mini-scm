import { constant } from '../../utils/constant';
import { service } from '../../service';
import { errDialog, loading } from '../../utils/util';
var app = getApp();
Page({
    data: {
        contactName: '',
        contactPhone: '',
        region: [],
        address: '',
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
    // 地址选择
    bindRegionChange: function(e) {
        this.setData({
            region: e.detail.value
        })
    },
    //上拉加载
    onReachBottom:function() {

    },
    //下拉刷新
    onPullDownRefresh:function() {

    }
})