// pages/addshelve/addshelve.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: {}
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
    })
  },

  backvalue: function (e) {
    if (e.detail.value.name&&e.detail.value.region_name&&e.detail.value.people&&e.detail.value.phone) {
      const cloud = app.cloud;
      const db = cloud.database()
      e.detail.value.region = this.data.region._id
      db.collection('shelve').add({
        data: e.detail.value
      }).then(res=>{
        db.collection('shelve').where({
          name: e.detail.value.name,
          region_name: e.detail.value.region_name
        }).get().then(res=>{
          db.collection('shelve_goods').add({
            data: {
              goods: [],
              shelve: res.data[0]._id
            }
          })
        })
      })
      setTimeout( function() {
         wx.showToast({
        title: '添加成功',
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
        title: '必填项为空',
        image: "/images/warning.png",
        mask: true,
        duration: 2000
      })
    }
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