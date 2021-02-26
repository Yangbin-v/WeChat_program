// pages/ware_manage/ware_manage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   region: {},
   shelveresult: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    // 监听SentDataToOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('SentDataToOpenerPage', (res) => {
      this.setData({
        region: res.data
      })
      this.getresult()
    })
  },

  Toeditpath: function(event) {
    var editdata = event.currentTarget.dataset.post;
    wx.navigateTo({
      url: '../editshelve/editshelve',
      success: (res) =>{
      // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('SentDataToOpenerPage', {data: editdata})
     }
    })
  },
  Toregionpath: function() {
    wx.navigateTo({
      url: '../editregion/editregion',
      success: (res) =>{
      // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('SentDataToOpenerPage', {data: this.data.region})
     }
    })
  },
  Toaddpath: function(event) {
    wx.navigateTo({
      url: '../addshelve/addshelve',
      success: (res) =>{
        // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('SentDataToOpenerPage', {data: this.data.region})
       }
    })
  },
  getresult: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const wares = db.collection('shelve')
    wares.where({
      region: this.data.region._id
    }).get().then(res => {
    this.setData({
      shelveresult: res.data
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