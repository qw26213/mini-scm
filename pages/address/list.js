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
            wx.getLocation({
                type: 'gcj02',
                success: (res) => {
                    const longitude = res.longitude
                    const latitude = res.latitude
                    const obj = {longitude, latitude}
                    this.getDataByLatLng(obj)
                },
                fail: (err) => {
                    errDialog('请设置允许访问位置信息！');
                }
            })
        } else {
            this.setData({ isWrite: true })
        }
    },
    onShow: function() {
        this.getData()
    },
    getDataByLatLng: function(obj) {
        service.getByLatLonDistance(obj).subscribe({
            next: res => {
                this.setData({
                    addrlist: res
                })
            },
            error: err => console.log(err),
            complete: () => wx.hideToast()
        })
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