import { service } from '../../service';
import { constant } from '../../utils/constant';
import { errDialog, loading } from '../../utils/util';
var app = getApp();
Page({
    data: {
        cart_list: [{
            productName: '商品名称商品名称商品名称',
            merchantName: '商户名称商户名称',
            skuName: '规格1',
            price: 30,
            count: 1
        }, {
            productName: '商品名称商品名称商品名称',
            merchantName: '商户名称商户名称',
            skuName: '规格1',
            price: 50,
            count: 1
        }],
        selectedAddress: true,
        addressInfo: {
            address: '北京市海淀区海淀黄庄街道海淀中关村大厦15楼',
            mobile: '18999990000',
            id: '12322424',
            name: '用户名'
        },
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
        if (num === -1 && result <= 0) {
            return
        }
        const count = `cart_list[${index}].count`
        this.setData({
            [count]: result
        })
        this.getAmount()
    },
    getAmount: function() {
        var amount = 0
        this.data.cart_list.forEach(item => {
            amount += item.price * item.count
        })
        console.log(amount)
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
    onPullDownRefresh:function() {
        this.setData({ pageNo: 1 });
    },
    //上拉加载
    onReachBottom:function() {
        if(this.data.isFinall){
            return;
        }
        this.setData({
            pageNo: this.data.pageNo + 1
        })
    },
    toPath: function(e) {
        var url = e.currentTarget.dataset.url;
        wx.navigateTo({ url: url });
    },
    toPay: function(e) {
        wx.showToast({
            title: '订单提交成功',
            icon: 'success',
            success() {
                wx.navigateTo({
                    url: '/pages/orderlist/index'
                });
            }
        });
    }
});