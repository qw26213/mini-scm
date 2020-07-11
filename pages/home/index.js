import { constant } from '../../utils/constant';
import { service } from '../../service';
import { errDialog, loading } from '../../utils/util';
var app = getApp();
Page({
    data: {
        tablist: [],
        locationCode: '',
        tabCode: '0',
        locationName: '',
        productList: [],
        isFinall: false,
        isShowNodata: false
    },
    onLoad: function(options) {
        wx.showShareMenu({ withShareTicket: true })
        this.getTab()
        this.getData()
    },
    toDetail: function(e) {
        var id = e.currentTarget.dataset.id
        var storeid = 10 // e.currentTarget.dataset.storeid;
        wx.navigateTo({
            url: '/pages/detail/index?share=0&referer=0&id=' + id
        });
    },
    getDataByCode: function(e) {
        const code = e.currentTarget.dataset.code
        this.setData({tabCode: code})
        this.getData()
    },
    getTab: function() {
        service.tablist().subscribe({
            next: res => {
                const result = res || []
                this.setData({ 
                    tablist: result
                });
            },
            error: err => errDialog(err),
            complete: () => wx.hideToast()
        })
    },
    getData: function() {
        service.productlist({tabCode: this.data.tabCode}).subscribe({
            next: res => {
                const result = res || []
                this.setData({ 
                    productList: result,
                    isFinall: result.length == 0 ? true : false
                });
                this.setData({ isShowNodata: this.data.productList.length == 0 });
            },
            error: err => errDialog(err),
            complete: () => wx.hideToast()
        })
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