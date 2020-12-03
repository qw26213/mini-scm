import { constant } from '../../utils/constant';
import { service } from '../../service';
import { errDialog, loading } from '../../utils/util';
var app = getApp();
Page({
    data: {
        id: '',
        contact: '',
        tel: '',
        region: [],
        addr: '',
        isDelivery: false,
        custContact: '',
        custTel: '',
        custAddr: ''
    },
    onLoad: function(options) {
        wx.showShareMenu({ withShareTicket: true })
        if (options.id) {
            this.setData({id:options.id})
            wx.setNavigationBarTitle({title: '编辑收货地址'})
            service.addrGet({id: options.id}).subscribe({
                next: res => {
                    this.setData({
                        contact: res.contact,
                        tel:res.tel,
                        addr: res.addr,
                        region: [res.province, res.city, res.district]
                    })
                },
                error: err => {},
                complete: () => wx.hideToast()
            })
        } else {
            wx.setNavigationBarTitle({title: '新增收货地址'})
        }
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
    switch1Change: function() {
        this.setData({ isDelivery: !this.data.isDelivery })
    },
    bindInput1: function(e) {
        this.setData({contact: e.detail.value})
    },
    bindInput2: function(e) {
        this.setData({tel: e.detail.value})
    },
    bindInput3: function(e) {
        this.setData({addr: e.detail.value})
    },
    bindInput4: function(e) {
        this.setData({custContact: e.detail.value})
    },
    bindInput5: function(e) {
        this.setData({custTel: e.detail.value})
    },
    bindInput6: function(e) {
        this.setData({custAddr: e.detail.value})
    },
    delData: function(){
        var id = this.data.id
        wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            confirmColor: '#c3a769',
            showCancel: true,
            success: (res) => {
                if (res.confirm) {
                    wx.showLoading({ title: '删除中', mask: true });
                    var obj = {id:id}
                    service.addrDel(obj).subscribe({
                        next: res => {
                            wx.hideLoading()
                            wx.showToast({title: '已删除'})
                            setTimeout(() => {
                                wx.navigateBack()
                            }, 1500)
                        },
                        error: err => errDialog(err),
                        complete: () => wx.hideToast()
                    })
                }
            }
        })
    },
    saveData: function() {
        const data = {
            id: this.data.id,
            contact: this.data.contact,
            tel: this.data.tel,
            addr: this.data.addr,
            province: this.data.region[0],
            city: this.data.region[1],
            district: this.data.region[2],
            custContact: this.data.custContact,
            custTel: this.data.custTel,
            custAddr: this.data.custAddr,
            isDelivery: this.data.isDelivery ? 1 : 0
        }
        if (this.data.contact === '') {
            wx.showToast({
                title: '收货人不能为空',
                icon: 'none'
            })
            return
        }
        if (this.data.tel === '') {
            wx.showToast({
                title: '手机号码不能为空',
                icon: 'none'
            })
            return
        }
        if (this.data.region.length === 0) {
            wx.showToast({
                title: '所在地区不能为空',
                icon: 'none'
            })
            return
        }
        if (this.data.addr === '') {
            wx.showToast({
                title: '详细地址不能为空',
                icon: 'none'
            })
            return
        }
        service.addrSave(data).subscribe({
            next: res => {
                wx.showToast({
                    title: '地址保存成功',
                    icon: 'none'
                })
                wx.navigateBack()
            },
            error: err => {},
            complete: () => wx.hideToast()
        })
    }
})