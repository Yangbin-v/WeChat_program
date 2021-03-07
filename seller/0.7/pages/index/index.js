//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '样板小程序',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    flag: true
  },
  //事件处理函数
  Tosetpath: function() {
    wx.navigateTo({
      url: '../set/set'
    })
  },
  Towarepath: function() {
    wx.navigateTo({
      url: '../ware/ware'
    })
  },
  Toginoutpath: function() {
    wx.navigateTo({
      url: '../ginout/ginout'
    })
  },
  To_region_manage_path: function() {
    wx.navigateTo({
      url: '../region_manage/region_manage'
    })
  },
  To_good_manage_path: function() {
    wx.navigateTo({
      url: '../goodmanage/goodmanage'
    })
  },
  To_shelve_in_path: function() {
    wx.navigateTo({
      url: '../inshelvedetail/inshelvedetail'
    })
  },
  To_shelve_out_path: function() {
    wx.navigateTo({
      url: '../outshelvedetail/outshelvedetail'
    })
  },

  To_shelve_view_path: function() {
    wx.navigateTo({
      url: '../shelve_view/shelve_view'
    })
  },

  To_shelve_Inventory_path: function() {
    wx.navigateTo({
      url: '../shelve_Inventory/shelve_Inventory'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onPullDownRefresh: function() {
    app.onRefresh()
  }
})
