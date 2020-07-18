import {service} from '../../service';
import { errDialog, loading } from '../../utils/util'
const app = getApp();
Page({
    data: {
        datalist: [],
        isWrite: false,
        isShowNull:true,
        certStatus:0,
        roleType:0
    },
    onLoad: function(options) {
        if (options.type) {
            this.setData({isWrite: false })
        } else {
            this.setData({isWrite: true })
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
                    isShowNull:this.data.datalist.length!=0 
                })
            },
            error: err => console.log(err),
            complete: () => wx.hideToast()
        })
    },
    selectAddress:function(e) {
        var id = e.currentTarget.dataset.id
        if (!this.data.isWrite) {
            wx.setStorageSync('selectAddrId', id)
            wx.navigateBack(-1)
        }
    },
    toModify:function(e){
        var id = e.currentTarget.dataset.id
        wx.navigateTo({ url: '/pages/address/index?id='+id })
    },
    toDefault: function(e) {
        var id = e.currentTarget.dataset.id
        var obj = {id:id}
        wx.showLoading({ title: '请求中', mask: true });
        service.addrDefault(obj).subscribe({
            next: res => {
                wx.hideLoading()
                this.getData();
                wx.showToast({title: '设置成功'})
            },
            error: err => errDialog(err),
            complete: () => wx.hideToast()
        })
    },
    toDel:function(e){
        var id = e.currentTarget.dataset.id
        wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            showCancel: true,
            success: () => {
                wx.showLoading({ title: '请求中', mask: true });
                var obj = {id:id}
                service.addrDel(obj).subscribe({
                    next: res => {
                        wx.hideLoading()
                        this.getData();
                        wx.showToast({title: '已删除'})
                    },
                    error: err => errDialog(err),
                    complete: () => wx.hideToast()
                })
            }
        })
    },
    toAdd: function(){
        wx.navigateTo({ url: '/pages/address/index?from=any' });
    }
});