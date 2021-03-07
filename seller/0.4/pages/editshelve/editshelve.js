// pages/editshelve/editshelve.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editor: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    // 监听SentDataToOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('SentDataToOpenerPage', (res) => {
      this.setData({
        editor: res.data
      })
    })
  },

  backvalue: function (e) {
    if (e.detail.value.name&&e.detail.value.region_name&&e.detail.value.people&&e.detail.value.phone) {
      wx.cloud.init({
        env: "test-6gbfgwps390db2f7"//默认云开发环境配置
      })
      const db = wx.cloud.database()
      e.detail.value.region = this.data.editor.region
      db.collection('shelve').doc(this.data.editor._id).set({
        data: e.detail.value
      })
      setTimeout( function() {
         wx.showToast({
        title: '修改成功',
        icon: "success",
        mask: true,
        duration: 1000
      })
      },500);
      wx.navigateBack({
        delta: 1
      })
    }
    else {
      wx.showToast({
        title: '必填项不能为空',
        image: "/images/warning.png",
        mask: true,
        duration: 2000
      })
    }
},

delete: function () {
  wx.cloud.init({
    env: "test-6gbfgwps390db2f7"//默认云开发环境配置
  })
  const db = wx.cloud.database()
  db.collection('shelve').doc(this.data.editor._id).remove()
  db.collection('shelve_goods').where({
    shelve: this.data.editor._id
  }).remove()
  setTimeout( function() {
    wx.showToast({
   title: '删除成功',
   icon: "success",
   mask: true,
   duration: 1000
 })
 },500);
 wx.navigateBack({
   delta: 1
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