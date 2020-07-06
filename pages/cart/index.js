import { service } from '../../service';
import { constant } from '../../utils/constant';
import { errDialog, loading } from '../../utils/util';
var app = getApp();
Page({
    data: {
        cart_list: [{
            productName: '商品名称111111111111111',
            skuName: '规格1',
            price: 30,
            count: 1,
            checked: false
        }, {
            productName: '商品名称222222222222222',
            skuName: '规格1',
            price: 50,
            count: 1,
            checked: false
        }],
        amount: 0
    },
    onLoad: function(options) {
        wx.hideShareMenu()
        this.getAmount()
    },
    addNumber: function(e) {
        var num = e.currentTarget.dataset.arrow === 'right' ? 1 : -1
        var index = e.currentTarget.dataset.index
        var result = this.data.cart_list[index].count + num
        const count = `cart_list[${index}].count`
        this.setData({
            [count]: result
        })
        this.getAmount()
    },
    switchChecked: function(e) {
        var index = e.currentTarget.dataset.index
        var check = this.data.cart_list[index].checked
        const checked = `cart_list[${index}].checked`
        this.setData({
            [checked]: !check
        })
        this.getAmount()
    },
    getAmount: function() {
        var amount = 0
        this.data.cart_list.forEach(item => {
            if (item.checked) {
                amount += item.price * item.count
            }
        })
        this.setData({ amount: amount })
    },
    getData: function(status) {
        var obj = {
            status: status,
            pageNo: this.data.pageNo,
            pageSize: 10
        }
        service.orderlist(obj).subscribe({
            next: res => {
                this.setData({
                    orderlist: this.data.orderlist.concat(res.content),
                    isFinall: res.content.length == 0 ? true : false
                });
                this.setData({ isShowNodata: this.data.orderlist.length == 0 });
            },
            error: err => errDialog(err),
            complete: () => wx.hideToast()
        })
    },
    //下拉刷新
    onPullDownRefresh: function() {
        this.setData({ pageNo: 1 });
        this.getData(this.data.status);
    },
    //上拉加载
    onReachBottom: function() {
        if (this.data.isFinall) {
            return;
        }
        this.setData({
            pageNo: this.data.pageNo + 1
        })
        this.getData(this.data.status)
    },
    toPay: function(e) {
        wx.navigateTo({ url: '/pages/orderPay/index' });
    }
});