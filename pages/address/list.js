import {service} from '../../service';
import { errDialog, loading } from '../../utils/util'
const app = getApp();
Page({
    data: {
        datalist: [{
            address: '北京市海淀区海淀黄庄街道海淀中关村大厦15楼',
            mobile: '18999990000',
            id: '12322424',
            name: '用户名'
        },{
            address: '北京市海淀区海淀黄庄街道海淀中关村大厦15楼',
            mobile: '18999990000',
            id: '12322424',
            name: '用户名'
        }],
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
    getData: function() {
        service.listStores().subscribe({
            next: res => {
                this.setData({ datalist: res,isShowNull:res.length!=0 })
            },
            error: err => console.log(err),
            complete: () => wx.hideToast()
        })
    },
    selectAddress:function() {
        if (!this.data.isWrite) {
            wx.navigateBack(-1)
        }
    },
    toModify:function(e){
        var id = e.currentTarget.dataset.id
        wx.navigateTo({ url: '/pages/address/index?id='+id })
    },
    toDel:function(e){
        var id = e.currentTarget.dataset.id;
        wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            showCancel: true,
            success: () => {
                // wx.showLoading({ title: '删除中', mask: true });
                // var obj = {num:1,storeId:id}
                // service.applyDevice(obj).subscribe({
                //     next: res => {
                //         wx.hideLoading()
                //         this.getData();
                //         wx.showToast({title: '设备申请成功',icon:'success'});
                //     },
                //     error: err => errDialog(err),
                //     complete: () => wx.hideToast()
                // })
            }
        })
    },
    toAdd: function(){
        wx.navigateTo({ url: '/pages/address/index?from=any' });
    }
});