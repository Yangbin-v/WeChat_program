// pages/mine/mine.js
var base = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '用户ID',
  },
  onGotUserInfo:function (e) {//授权登陆
    const { userInfo } = e.detail
    console.log(e)
    this.setData({
        userInfo: userInfo
    })
},
onLoad: function () {
  var that = this
  //调用应用实例的方法获取全局数据
  base.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
          userInfo: userInfo
      })
  })
},
onShow: function (){
  var that = this
  //调用应用实例的方法获取全局数据
  base.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
          userInfo: userInfo
      })
  })
},
  onPullDownRefresh: function() {
    base.onRefresh()
  },
  Todiscount: function() {
    wx.navigateTo({
      url: 'my-discount/my-discount'
    })
  },
  Toorders: function() {
    wx.navigateTo({
      url: 'my-orders/my-orders'
    })
  },
  Toservice: function() {
    wx.navigateTo({
      url: 'my-service/my-service'
    })
  },
  Tosupplement: function() {
    wx.navigateTo({
      url: 'my-supplement/my-supplement'
    })
  },
})