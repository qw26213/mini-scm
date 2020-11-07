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
        imglist: [],
        isFinall: false,
        isShowNodata: false
    },
    onLoad: function(options) {
        console.log('home page------------')
        wx.showShareMenu({ withShareTicket: true })
        this.getTab()
        this.getData()
    },
    toDetail: function(e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/detail/index?id=' + id
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
        service.productlist({tabCode: this.data.tabCode, isDisable: 0 }).subscribe({
            next: res => {
                const result = res || []
                this.setData({ 
                    productList: result,
                    isFinall: result.length == 0 ? true : false
                });
                this.setData({ isShowNodata: this.data.productList.length == 0 });
                const imglist = this.data.productList.filter(item => item.isRotate === 1)
                this.setData({imglist: imglist})
            },
            error: err => errDialog(err),
            complete: () => wx.hideToast()
        })
    },
    onShareAppMessage: function(res) {
        return {
            title: '快销在线，生活的好帮手',
            imageUrl: '/images/shareImg.png',
            path: '/pages/login/index?referer=1&shareCode=' + wx.getStorageSync('shareCode')
        }
    },
    //上拉加载
    onReachBottom:function() {

    },
    //下拉刷新
    onPullDownRefresh:function() {

    }
})