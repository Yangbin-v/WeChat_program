// pages/ware/ware.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wareresult: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getresult()
  },

  Toeditpath: function(event) {
    var editware = event.currentTarget.dataset.post;
    wx.navigateTo({
      url: '../editware/editware',
      success: (res) =>{
      // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('SentDataToOpenerPage', {data: editware})
     }
    })
  },
  Toaddpath: function(event) {
    wx.navigateTo({
      url: '../addware/addware',
    })
  },
  getresult: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const wares = db.collection('wares')
    wares.get().then(res => {
    this.setData({
      wareresult: res.data
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
    this.getresult()
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