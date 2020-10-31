//logs.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
  /**
   * 生命周期函数--监听页面下拉
   */
  onPullDownRefresh: function() {
    app.onRefresh()
  }
})
