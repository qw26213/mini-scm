import { service } from '../../service';
import { errDialog, loading } from '../../utils/util'
const app = getApp();
Page({
    data: {
        datalist: [],
        addrlist: [],
        isWrite: false,
        isShowNull: true,
        certStatus: 0,
        roleType: 0
    },
    onLoad: function(options) {
        if (options.type) {
            this.setData({ isWrite: false })
        } else {
            this.setData({ isWrite: true })
        }
    },
    onShow: function() {
        this.getData()
    },
    getData: function() {
        service.addrlist().subscribe({
            next: res => {
                this.setData({
                    datalist: res.filter(item => item.tel !== null),
                })
                this.setData({
                    isShowNull: this.data.datalist.length != 0
                })
            },
            error: err => console.log(err),
            complete: () => wx.hideToast()
        })
    },
    selectAddress: function(e) {
        var id = e.currentTarget.dataset.id
        if (!this.data.isWrite) {
            wx.setStorageSync('selectAddrId', id)
            wx.navigateBack(-1)
            this.setDefault(id)
        } else {
            wx.navigateTo({ url: '/pages/address/index?id=' + id })
        }
    },
    selectAddr: function(e) {
        var id = e.currentTarget.dataset.id
        if (!this.data.isWrite) {
            wx.setStorageSync('selectAddrId', id)
            wx.navigateBack(-1)
            this.setDefault(id)
        } else {
            wx.navigateTo({ url: '/pages/address/index?id=' + id })
        }
    },
    setDefault: function(id) {
        service.addrDefault({ id }).subscribe({
            next: res => {
                console.log('默认地址ok')
            },
            error: err => errDialog(err),
            complete: () => wx.hideToast()
        })
    },
    toAdd: function() {
        wx.navigateTo({ url: '/pages/address/index?from=any' });
    }
});