// pages/addware/addware.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  backvalue: function (e) {
    if (e.detail.value.name&&e.detail.value.addr&&e.detail.value.wareman&&e.detail.value.phone) {
      const cloud = app.cloud;
      const db = cloud.database()
      db.collection('wares').add({
        data: e.detail.value
      })
      setTimeout( function() {
        db.collection('wares').where({
          name: e.detail.value.name
        }).get({
          success: res => {
            const _ = db.command
            db.collection('goods').where({}).update({
              data: {
                ware: {
                  [res.data[0]._id]: 0
                }
              }
            })
          }
        })
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