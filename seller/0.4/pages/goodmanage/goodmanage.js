// pages/goodmanage/goodmanage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageflag: true,
    goods: [],
    kinds: [],
    inputvalue: '',
    toppage: false,
    kindpage: false,
    del_kind: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getgoods()
    this.getkinds()
  },

  inputsearch: function (e) {
    this.setData({
      inputvalue: e.detail.value
    })
    this.searchgoods(this.data.inputvalue)
  },

  searchgoods: function (e) {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const _ = db.command
    const wares = db.collection('goods')
    var reg = new RegExp('.*('+e+').*')
    wares.where(_.or([
      {
        barcode: e
      },
      {
        name: reg
      }
    ])).get().then(res => {
      this.setData({
        goods: res.data
      })
  })
  },

  delete: function() {
    var _this=this
    setTimeout(function () {
      _this.setData({
        inputvalue: ''
      })
      _this.searchgoods(_this.data.inputvalue)
  },100)
  },

  phonescan: function () {
    var that = this;
    wx.scanCode({
      success (res) {
        that.searchcode(res.result)
      }
    })
  },

  searchcode: function (code) {
    var that = this;
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const wares = db.collection('goods') 
    wares.where({
      barcode: code
    }).get().then(res => {
      if (res.data.length != 0) {
        this.setData({
          goods: res.data
        })
      }
      else {
        wx.showModal({
          title: '!',
          content: '新商品，是否添加',
          success (res) {
            if (res.confirm) {
              that.Toaddgood()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
  })
  },

  Tokindpage: function (event) {
    var kind = event.currentTarget.dataset.post;
    wx.navigateTo({
      url: '../kindpage/kindpage',
      success: (res) =>{
      // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('SentDataToOpenerPage', {data: kind})
     }
    })
  },

  getgoods: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const wares = db.collection('goods')
    wares.get().then(res => {
      this.setData({
        goods: res.data
      })
    })
  },

  getkinds: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const wares = db.collection('kinds')
    wares.get().then(res => {
      this.setData({
        kinds: res.data
      })
    })
  },

  deletepage: function(e) {
    this.setData({
      kindpage: true
    })
    var delkind = e.currentTarget.dataset.delekind;
    this.setData({
      del_kind: delkind
    })
  },

  deletekind: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    db.collection('kinds').doc(this.data.del_kind._id).remove()
    db.collection('goods').where({
      category: this.data.del_kind.name
    }).remove()
    this.setData({
      kindpage: false
    })
    setTimeout( function() {
      wx.showToast({
        title: '删除成功',
        icon: "success",
        mask: true,
        duration: 1000
      })
    },500);
    this.getgoods()
    this.getkinds()
    app.onRefresh()
  },
  toeditgood:function(event) {
    var edgood = event.currentTarget.dataset.edgood;
    wx.navigateTo({
      url: '../editgoods/editgoods',
      success: (res) =>{
      // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('SentDataToOpenerPage', {data: edgood})
     }
    })
  },

  Toaddgood:function() {
    wx.navigateTo({
      url: '../addgood/addgood'
    })
  },

  switchpage1: function() {
    var that = this
    this.setData({
      pageflag: true
    })
  },
  switchpage2: function() {
    var that = this
    this.setData({
      pageflag: false
    })
  },

  ftoppage: function() {
    this.setData({
      toppage: true
    })
  },

  addkindpage:function(e) {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    db.collection('kinds').add({
      data: {
        name: e.detail.value.kind
      }
    })
    this.setData({
      toppage: false
    })
    setTimeout( function() {
      wx.showToast({
        title: '增加成功',
        icon: "success",
        mask: true,
        duration: 1000
      })
    },500);
    this.getgoods()
    this.getkinds()
    app.onRefresh()
  },

  quxi: function() {
    this.setData({
      toppage: false
    })
    this.setData({
      kindpage: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getgoods()
    this.getkinds()
    app.onRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})