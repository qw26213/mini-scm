import { service } from '../../service';
import { constant } from '../../utils/constant';
import { errDialog, loading } from '../../utils/util';
var app = getApp();
Page({
    data: {
        cart_list: [],
        goodsId: '',
        addresslist: [],
        selectedAddr: true,
        addrInfo: {},
        amount: 0
    },
    onLoad: function(options) {
        console.log(options)
        wx.hideShareMenu()
        if (options.type == 1) {
            this.setData({ goodsId: options.id })
            this.getData(options.id, options.sid, options.count)
        } else {
            service.cartlist().subscribe({
                next: res => {
                    this.setData({ cart_list: res || [] })
                    this.getAmount()
                },
                error: err => errDialog(err),
                complete: () => wx.hideToast()
            })
        }
        service.addrlist().subscribe({
            next: res => {
                this.setData({ addresslist: res })
                this.setData({
                    addrInfo: res.find(item => item.isDefault == 1),
                    selectedAddr: res.some(item => item.isDefault == 1 && item.tel)
                })
            },
            error: err => console.log(err),
            complete: () => wx.hideToast()
        })
    },
    onShow: function() {
        var selectAddrId = wx.getStorageSync('selectAddrId')
        if (this.data.addresslist.length > 0) {
            this.setData({
                addrInfo: this.data.addresslist.find(item => item.id === selectAddrId)
            })
        }
    },
    getAmount: function() {
        var amount = 0
        this.data.cart_list.forEach(item => {
            amount += item.price * item.qty
        })
        this.setData({ amount: amount })
    },
    getData: function(id, sid, count) {
        service.getGoodsById({ id: id }).subscribe({
            next: res => {
                var productList = res.detailLine || []
                var cart_list = []
                var productInfo = productList.find(item => item.id == sid)
                productInfo.qty = Number(count)
                cart_list.push(productInfo)
                this.setData({ cart_list: cart_list })
                console.log(this.data.cart_list)
                this.getAmount()
            },
            error: err => errDialog(err),
            complete: () => wx.hideToast()
        })
    },
    //下拉刷新
    onPullDownRefresh: function() {
        this.setData({ pageNo: 1 });
    },
    //上拉加载
    onReachBottom: function() {
        if (this.data.isFinall) {
            return
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
        if (Object.keys(this.data.addrInfo).length === 0) {
            errDialog('请选择收货地址!')
            return
        }
        var obj = {
            salesDetail: this.data.cart_list.map(item => {
                return {
                    goodsId: this.data.goodsId,
                    goodsDetailId: item.id,
                    itemName: item.itemName,
                    vatPrice: item.price,
                    itemId: item.id,
                    qty: item.qty,
                    norms: item.norms,
                    multi: item.multi,
                    itemAmont: item.price * item.qty
                }
            }),
            sumAmount: this.data.amount,
            contact: this.data.addrInfo.contact,
            tel: this.data.addrInfo.tel,
            province: this.data.addrInfo.province,
            city: this.data.addrInfo.city,
            district: this.data.addrInfo.district,
            addr: this.data.addrInfo.addr
        }
        wx.showLoading({title: '提交中'})
        service.orderSave(obj).subscribe({
            next: res => {
                wx.showToast({
                    title: '订单提交成功',
                    icon: 'success',
                    success() {
                        wx.navigateTo({
                            url: '/pages/orderlist/index'
                        });
                    }
                })
            },
            error: err => errDialog(err),
            complete: () => wx.hideToast()
        })
    }
});