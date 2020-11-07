import { service } from '../../service';
import { constant } from '../../utils/constant';
import { errDialog, loading } from '../../utils/util';
var app = getApp();
Page({
    data: {
        cart_list: [],
        hideConfirmModal: true,
        card_id: '',
        curIndex: 0,
        startX: 0,
        startY: 0,
        allChecked: false,
        isShowNodata: false,
        amount: 0
    },
    touchStart(e) { //移动前点击的位置
        console.log(e)
        // 在开始触摸时将所有startTouchMove设置为flase,对当前的为true
        this.data.cart_list.forEach(cart => {
            if (cart.isTouchMove) //当istouchMove为true
                cart.isTouchMove = false; //其它的对象都为false
        })
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
            cart_list: this.data.cart_list
        })
    },
    touchmove(e) { //移动的位置,用于计算用户滑动的弧度向左还是向右,移动了多少,可以确定删除功能的显示和隐藏
        let index = e.currentTarget.dataset.index;
        // 获取开始的x,y坐标
        let startX = this.data.startX,
            startY = this.data.startY;
        // 获取移动的x,x坐标
        let touchMoveX = e.changedTouches[0].clientX,
            touchMoveY = e.changedTouches[0].clientY;
        // 调用计算角度的方法,获取角度
        var angel = this.angel({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY })
        // 遍历cart_list
        this.data.cart_list.forEach((cart, i) => {
            cart.isTouchMove = false;
            // 滑动角度大于30,直接return 视为非滑动意思
            if (Math.abs(angel) > 30) return;
            // 匹配当前所点击的list和滑动的list
            if (i == index) {
                // 匹配上后判断滑动方向
                if (touchMoveX > startX) { //左滑动隐藏删除
                    cart.isTouchMove = false;
                } else {
                    cart.isTouchMove = true;
                }
            }
        })
        // 更新数据
        this.setData({
            cart_list: this.data.cart_list
        })
    },
    angel(start, end) { //计算滑动的角度 
        // console.log(start,end)
        // 移动坐标减去对应的开始坐标
        var _X = end.X - start.X,
            _Y = end.Y - start.Y;
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI)
    },
    showDel: function(e) {
        this.setData({
            card_id: e.currentTarget.dataset.id,
            hideConfirmModal: false,
            curIndex: e.currentTarget.dataset.index
        })
    },
    toIndex: function() {
        wx.switchTab({ url: "/pages/home/index" });
    },
    delOrder: function() {
        service.cartdel({ detailId: this.data.card_id }).subscribe({
            next: res => {
                const index = this.data.curIndex
                let aa = this.data.cart_list
                aa.splice(index, 1)
                this.setData({ cart_list: aa, hideConfirmModal: true })
                this.setData({ isShowNodata: this.data.cart_list.length == 0 })
            },
            error: err => errDialog(err),
            complete: () => wx.hideToast()
        })
    },
    saveGoodToCart: function(id1, id2, qty, price) {
        var obj = {
            goodsId: id1,
            goodsDetailId: id2,
            price: price,
            qty: qty
        }
        service.cartsave(obj).subscribe({
            next: res => {

            },
            error: err => {},
            complete: () => {}
        })
    },
    onShow: function(options) {
        wx.hideShareMenu()
        this.getData()
    },
    getData: function() {
        service.cartlist().subscribe({
            next: res => {
                this.setData({ cart_list: res || [] })
                this.getAmount()
                this.setData({ isShowNodata: this.data.cart_list.length == 0 });
            },
            error: err => {
                errDialog(err)
                this.setData({ isShowNodata: true });
            },
            complete: () => wx.hideToast()
        })
    },
    addNumber: function(e) {
        var num = e.currentTarget.dataset.arrow === 'right' ? 1 : -1
        var index = e.currentTarget.dataset.index
        var result = this.data.cart_list[index].qty + num
        if (e.currentTarget.dataset.arrow === 'left' && result == 0) { return }
        const qty = `cart_list[${index}].qty`
        this.setData({
            [qty]: result
        })
        this.saveGoodToCart(e.currentTarget.dataset.id, e.currentTarget.dataset.detailid, result, e.currentTarget.dataset.price)
        this.getAmount()
    },
    switchChecked: function(e) {
        var index = e.currentTarget.dataset.index
        var check = this.data.cart_list[index].checked
        const checked = `cart_list[${index}].checked`
        this.setData({
            [checked]: !check
        })
        this.getAmount()
        this.getCheckall()
    },
    allCheck: function(e) {
        this.setData({
            allChecked: !this.data.allChecked
        })
        this.data.cart_list.forEach((item, index) => {
            const checked = `cart_list[${index}].checked`
            this.setData({
                [checked]: this.data.allChecked
            })
        })
        this.getAmount()
    },
    getCheckall: function() {
        var status = this.data.cart_list.every(item => {
            return item.checked === true
        })
        this.setData({ allChecked: status })
    },
    getAmount: function() {
        var amount = 0
        this.data.cart_list.forEach(item => {
            if (item.checked) {
                amount += item.price * item.qty
            }
        })
        this.setData({ amount: amount })
    },
    //下拉刷新
    onPullDownRefresh: function() {
        this.setData({ pageNo: 1 });
        this.getData(this.data.status);
    },
    //上拉加载
    onReachBottom: function() {
        if (this.data.isFinall) {
            return;
        }
        this.setData({
            pageNo: this.data.pageNo + 1
        })
        this.getData(this.data.status)
    },
    toPay: function(e) {
        if (this.data.amount === 0) {
            wx.showToast({
                title: '请勾选商品',
                icon: 'none'
            })
            return
        }
        wx.navigateTo({ url: '/pages/orderPay/index' })
    }
});