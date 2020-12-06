import { constant } from '../../utils/constant';
import { service } from '../../service';
import { errDialog, txtToast, loading } from '../../utils/util';
var app = getApp();
Page({
    data: {
        id: '',
        contact: '',
        tel: '',
        region: [],
        addr: '',
        isDelivery: false,
        custAddr: '',
        addrlist: [],
        custIndex: -1,
        latitude: '',
        longitude: ''
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
                        region: [res.province, res.city, res.district],
                        isDelivery: res.isDelivery == 1,
                        custAddr: res.custAddr
                    })
                },
                error: err => {},
                complete: () => wx.hideToast()
            })
        } else {
            wx.setNavigationBarTitle({title: '新增收货地址'})
        }
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
                const longitude = res.longitude
                const latitude = res.latitude
                const obj = {longitude, latitude}
                this.setData({ longitude, latitude })
                this.getDataByLatLng(obj)
            },
            fail: (err) => {
                errDialog('请设置允许访问位置信息！');
            }
        })
    },
    getDataByLatLng: function(obj) {
        service.getByLatLonDistance(obj).subscribe({
            next: res => {
                const result = res || []
                this.setData({
                    addrlist: result
                })
            },
            error: err => console.log(err),
            complete: () => wx.hideToast()
        })
    },
    toDetail: function(e) {
        var id = 10 // e.currentTarget.dataset.id;
        var storeid = 10 // e.currentTarget.dataset.storeid;
        wx.navigateTo({
            url: '/pages/detail/index?share=0&referer=0&id=' + id + '&storeid=' + storeid
        });
    },
    switchChange: function() {
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
    bindRegionChange: function(e) {
        this.setData({
            region: e.detail.value
        })
    },
    bindCustChange: function(e) {
        if (e.detail.value > -1) {
            this.setData({
                custIndex: e.detail.value,
                custAddr: this.data.addrlist[e.detail.value].addr
            })
        }
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
            isDelivery: this.data.isDelivery ? 1 : 0
        }
        if (this.data.contact === '') {
            txtToast('收货人不能为空')
            return
        }
        if (this.data.tel === '') {
            txtToast('手机号码不能为空')
            return
        }
        if (this.data.region.length === 0) {
            txtToast('所在地区不能为空')
            return
        }
        if (this.data.addr === '') {
            txtToast('详细地址不能为空')
            return
        }
        if (this.data.isDelivery && this.data.custAddr == '') {
            txtToast('请选择自提网点')
            return
        }
        if (this.data.isDelivery) {
            const obj = this.data.addrlist[this.data.custIndex]
            var reqObj = {
                custContact: obj.custName,
                custTel: obj.tel,
                custAddr: obj.addr,
                longitude: this.data.longitude,
                latitude: this.data.latitude,
                ...data
            }
        } else {
            var reqObj = data
        }
        service.addrSave(reqObj).subscribe({
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