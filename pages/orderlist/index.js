import { service } from '../../service';
import { constant } from '../../utils/constant';
import { errDialog, loading } from '../../utils/util';
var app = getApp();
Page({
    data: {
        tablist: [{ name: '全部', status: 'ALL' }, { name: '待付款', status: 'CREATED' }, { name: '待发货', status: 'PAID' }, { name: '待收货', status: 'COMPLETED' }],
        curTabIndex: 0,
        constant: constant,
        isShowNodata: false,
        orderlist: [],
        pageIndex: 1,
        status: '',
        isFinall: false,
        amount: 0
    },
    onLoad: function(options) {
        wx.hideShareMenu();
        this.getData(options.status);
    },
    toIndex: function() {
        wx.switchTab({ url: "/pages/home/index" });
    },
    toDetail: function(e) {
        var id = e.currentTarget.dataset.id;
        var status = e.currentTarget.dataset.status;
        wx.navigateTo({ url: "/pages/orderinfo/index?id=" + id });
    },
    switchTab: function(e) {
        var thisIndex = e.currentTarget.dataset.index
        var thisStatus = e.currentTarget.dataset.status
        if (thisStatus == this.data.status) { return }
        this.setData({ curTabIndex: thisIndex, status: thisStatus })
        // this.setData({ isFinall:false,pageIndex: 1,orderlist:[] })
        // this.getData(thisStatus)
    },
    getData: function(status) {
        var obj = {
            status: status,
            pageIndex: this.data.pageIndex,
            pageNum: 5
        }
        service.orderList(obj).subscribe({
            next: res => {
                this.setData({
                    orderlist: this.data.orderlist.concat(res),
                    isFinall: res.length < 5 ? true : false
                });
                this.setData({ isShowNodata: this.data.orderlist.length == 0 });
            },
            // error: err => errDialog(err),
            complete: () => wx.hideToast()
        })
    },
    //下拉刷新
    onPullDownRefresh: function() {
        this.setData({ pageIndex: 1 });
        this.getData(this.data.status);
    },
    //上拉加载
    onReachBottom: function() {
        if (this.data.isFinall) {
            return;
        }
        this.setData({
            pageIndex: this.data.pageIndex + 1
        })
        this.getData(this.data.status);
    },
    toPay: function(e) {
        let that = this;
        var payInfo = JSON.parse(e.currentTarget.dataset['pre']);
        wx.requestPayment({
            timeStamp: payInfo.timeStamp,
            nonceStr: payInfo.nonceStr,
            package: payInfo.package,
            signType: payInfo.signType,
            paySign: payInfo.paySign,
            success(res2) {
                that.setData({ curTabIndex: 2 });
                that.getData('PAID');
                that.setData({ isFinall: false, pageIndex: 1 });
                wx.navigateTo({ url: "/pages/orderDetail/index?id=" + e.currentTarget.dataset['id'] });
            },
            fail(res2) {
                if (res2.errMsg == 'requestPayment:fail cancel') {
                    wx.showToast({
                        title: '用户取消支付',
                        icon: 'none'
                    });
                }
            }
        });
    }
});