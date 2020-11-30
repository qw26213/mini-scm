import { service } from '../../service';
import { errDialog, loading } from '../../utils/util'
const app = getApp();
Page({
    data: {
        name: '',
        mobile: '',
        code: '',
        password: '',
        timer: null,
        latitude: '',
        loctionName: '',
        longitude: '',
        longitude: '',
        showTime: false,
        count: 60
    },
    onLoad() {
      
    },
    bindInput0: function(e) {
        this.setData({ name: e.detail.value })
    },
    bindInput1: function(e) {
        this.setData({ mobile: e.detail.value })
    },
    bindInput2: function(e) {
        this.setData({ code: e.detail.value })
    },
    bindInput3: function(e) {
        this.setData({ password: e.detail.value })
    },
    showRestTime: function() {
        if (!this.data.timer) {
            this.data.count = 59;
            this.data.showTime = true
            this.data.timer = setInterval(() => {
                if (this.data.count > 1 && this.data.count <= 60) {
                    const count = this.data.count - 1
                    this.setData({count: count })
                } else {
                    this.setData({showTime: false })
                    clearInterval(this.data.timer);
                    this.setData({ timer: null })
                }
            }, 1000)
        }
    },
    getCode: function() {
        if (this.data.mobile == "") {
            errDialog('手机号不能为空！');
            return;
        }
        if (!checkMobile(this.data.mobile)) {
            errDialog('手机号格式不正确！');
            return;
        }
        wx.request({
            url: constant.loginUrl + '/sms/verify?phone_number=' + this.mobile,
            method: 'PUT',
            header: { 'content-type': 'application/json' },
            success: (res) => {
                if (res.data.code == 201) {
                    wx.showToast({ title: '发送成功', icon: 'success' })
                    this.showRestTime()
                } else {
                    errDialog(res.data.message)
                }
            }
        });
    },
    chooseLocal:function() {
        wx.chooseLocation({
            success: (res) => {
                this.setData({ loctionName: res.name })
                this.setData({ latitude: res.latitude })
                this.setData({ longitude: res.longitude })
            }
        })
    },
    submit: function() {
        if (this.data.name == "") {
            errDialog('用户名不能为空！')
            return;
        }
        if (this.data.mobile == "") {
            errDialog('手机号不能为空！')
            return;
        }
        if (!checkMobile(this.data.mobile)) {
            errDialog('手机号格式不正确！')
            return;
        }
        if (this.data.code == "") {
            errDialog('验证码不能为空！')
            return;
        }
        wx.request({
            url: constant.loginUrl + '/admin/register',
            method: 'post',
            header: { 'content-type': 'application/json' },
            data,
            success: (res) => {
                if (res.data.code == 201) {
                    wx.showToast({
                        title: '注册成功',
                        icon: 'success'
                    })
                    wx.setStorageSync('userId', res.data.data.id)
                    setTimeout(() => {
                        wx.reLaunch({
                            url: '/pages/login/index'
                        })
                    }, 1800)
                } else {
                    errDialog(res.data.message)
                }
            }
        })
    },
});