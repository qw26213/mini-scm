// components/confirmBox/confirmBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hideConfirmModal:{
      type: Boolean,
      value: false
    },
    confirmBoxTitle:{
      type:String,
      value:''
    },
    confirmBoxContent: {
      type: String,
      value: ''
    },
    showCloseWinBtn:{
      type: Boolean,
      value: true
    },
    btnTitle:{
      type: String,
      value: '确定'
    },
    modalTapClose:{
      type: Boolean,
      value: true
    }

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeConfirmModal: function(){
      this.doConfirmBtn()
    },
    closeByTapModal: function(){
      if (this.data.modalTapClose){
        this.setData({
          hideConfirmModal: true
        })
      }
    },
    doConfirmBtn: function(){
      this.triggerEvent('clickConfirmBtn');
    }
  }
})
