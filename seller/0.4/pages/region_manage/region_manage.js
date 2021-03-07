// pages/shelves/shevlves.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getresult()
  },

  getresult: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const shelves = db.collection('shelves_arae')
    shelves.get().then(res => {
    this.setData({
      region: res.data
    })
  })
  },

  To_shelvemanage_path: function(event) {
    var editdata = event.currentTarget.dataset.post;
    wx.navigateTo({
      url: '../shelve_manage/shelve_manage',
      success: (res) =>{
      // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('SentDataToOpenerPage', {data: editdata})
     }
    })
  },

  Toaddpath: function(event) {
    wx.navigateTo({
      url: '../addregion/addregion',
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
    this.onLoad()
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