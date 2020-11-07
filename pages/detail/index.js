import { constant } from '../../utils/constant';
import { service } from '../../service';
import { errDialog, loading } from '../../utils/util';
var app = getApp();
Page({
    data: {
        locationPcode: '',
        locationCode: '',
        locationName: '',
        goodsId: '',
        slide_image: [],
        content_image: [],
        enterpriseInfo: {},
        selectedId: '',
        productList: [],
        productInfo: {},
        count: 1,
        buyType: 1,
        isShowSelect: false,
        productPics: []
    },
    onLoad: function(options) {
        wx.showShareMenu({ withShareTicket: true })
        this.setData({ goodsId: options.id })
        this.getData(options.id)
        this.getEnterInfo()
    },
    call: function(e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.tel
        });
    },
    toBuy: function(e) {
        if (this.data.selectedId === '') {
            wx.showToast({
                title: '请选择商品规格',
                icon: 'none'
            })
            return
        }
        wx.navigateTo({
            url: '/pages/orderPay/index?type=1&id=' + this.data.goodsId + '&sid=' + this.data.selectedId + '&count=' + this.data.count
        })
    },
    gocartpage: function() {
        wx.switchTab({ url: '/pages/cart/index' })
    },
    toggleSelect: function() {
        this.setData({ isShowSelect: !this.data.isShowSelect })
    },
    addNumber: function(e) {
        var num = e.currentTarget.dataset.arrow === 'right' ? 1 : -1
        var index = e.currentTarget.dataset.index
        var result = this.data.count + num
        if (e.currentTarget.dataset.arrow === 'left' && result === 0) { return }
        this.setData({ count: result })
    },
    getData: function(id) {
        service.goodsAttachment({ headerId: id }).subscribe({
            next: res => {
                const result = res[0] || {}
                this.setData({
                    productPics: result
                })
            },
            error: err => errDialog(err),
            complete: () => wx.hideToast()
        })
        service.getGoodsById({ id: id }).subscribe({
            next: res => {
                const result = res || {}
                this.setData({
                    productInfo: result,
                    productList: result.detailLine,
                    slide_image: result.attachmentLine.filter(item => item.verticalDirection === 0),
                    content_image: result.attachmentLine.filter(item => item.verticalDirection === 1)
                })
            },
            error: err => errDialog(err),
            complete: () => wx.hideToast()
        })
    },
    getEnterInfo: function() {
        service.enterpriseInfo().subscribe({
            next: res => {
                const result = res || {}
                this.setData({
                    enterpriseInfo: result
                })
            },
            error: err => errDialog(err),
            complete: () => wx.hideToast()
        })
    },
    selectType: function(e) {
        const id = e.currentTarget.dataset.id
        const productInfo = this.data.productList.find(item => {
            return item.id === id
        })
        this.setData({ selectedId: id, productInfo: productInfo })
        this.setData({
            slide_image: [{ attachmentUrl: this.data.productInfo.fileUrl }]
        })
    },
    saveGoodToCart: function() {
        if (this.data.selectedId === '') {
            wx.showToast({
                title: '请选择商品规格',
                icon: 'none'
            })
            return
        }
        var obj = {
            goodsId: this.data.goodsId,
            goodsDetailId: this.data.selectedId,
            price: this.data.productInfo.price,
            qty: this.data.count
        }
        wx.hideLoading()
        service.cartsave(obj).subscribe({
            next: res => {
                this.toggleSelect()
                wx.showToast({
                    title: '加入购物车成功',
                    icon: 'none'
                })
            },
            error: err => errDialog(err),
            complete: () => {}
        })
    },
    joinBuy: function() {
        this.setData({ buyType: 2 })
        this.toggleSelect()
    },
    joinBus: function() {
        this.setData({ buyType: 1 })
        this.toggleSelect()
    },
    onShareAppMessage: function(res) {
        return {
            title: this.data.productInfo.itemName,
            imageUrl: this.data.slide_image[0].attachmentUrl,
            path: '/pages/login/index?referer=2&id=' + this.data.goodsId + '&shareCode=' + wx.getStorageSync('shareCode')
        }
    },
    //上拉加载
    onReachBottom: function() {

    },
    //下拉刷新
    onPullDownRefresh: function() {

    }
})