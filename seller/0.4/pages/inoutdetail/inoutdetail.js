// pages/inoutdetail/inoutdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageflag: true,
    ware:{},
    datas: [],
    in: [],
    out: [],
    hideflag: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const eventChannel = this.getOpenerEventChannel()
    // 监听SentDataToOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('SentDataToOpenerPage', (res) => {
      this.setData({
        ware: res.ware
      })
      this.getin()
      this.getout()
    })
    
  },

  switchpage1: function() {
    var that = this
    this.data.hideflag = {}
    for (var i of this.data.out) {
      this.data.hideflag[i._id] = true
    }
    this.setData({
      datas: this.data.out,
      hideflag: this.data.hideflag,
      pageflag: true,
    })
  },
  switchpage2: function() {
    var that = this
    this.data.hideflag = {}
    for (var i of this.data.in) {
      this.data.hideflag[i._id] = true
    }
    this.setData({
      datas: this.data.in,
      hideflag: this.data.hideflag,
      pageflag: false,
    })
  },

  ifhide: function(e) {
    var ii = e.currentTarget.dataset.i
    if (this.data.hideflag[ii._id]) {
      this.data.hideflag[ii._id] = false
      this.setData({
        hideflag: this.data.hideflag
      })
    }
    else {
      this.data.hideflag[ii._id] = true
      this.setData({
        hideflag: this.data.hideflag
      })
    }
  },

  getin: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const wares = db.collection('goodsinlog') 
    wares.where({
      ware: {_id: this.data.ware._id}
    }).orderBy('date', 'desc').get().then(res => {
      this.data.in = res.data
    })
  },

  getout: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const wares = db.collection('goodsoutlog') 
    wares.where({
      ware: {_id: this.data.ware._id}
    }).orderBy('date', 'desc').get().then(res => {
      this.data.out = res.data
      this.data.hideflag = {}
      for (var i of this.data.out) {
        this.data.hideflag[i._id] = true
      }
      this.setData({
        datas: this.data.out,
        hideflag: this.data.hideflag
      })
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