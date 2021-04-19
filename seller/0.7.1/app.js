//app.js
App({
  cloud: null,
  mycloud: async function() {
    let client_cloud = new wx.cloud.Cloud({
      resourceAppid: 123,
      resourceEnv: 123
    })
    await client_cloud.init();
    return client_cloud;
  },

  onLaunch: function () {
    this.mycloud().then((res)=>{
      this.cloud = res;
    })
    //云环境初始化
    wx.cloud.init({
      
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  //刷新
  getList: function() {
    wx.request({
      url: '',
      data: {},
      header: "",
      method: "GET",
      success: function(res) {

       }
      })
      // 隐藏loading提示框
      setTimeout( function() {
        wx.hideLoading()
      // 隐藏导航条加载动画
      },1500);
      //定时器模拟
       wx.hideNavigationBarLoading()
       //停止下拉刷新
       wx.stopPullDownRefresh()
  },
  onRefresh: function() {
    // 导航条加载动画
    wx.showNavigationBarLoading()
    //loading提示框
    wx.showLoading({title: '转的好晕', icon: 'loading', duration: 500})
    this.getList() 
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onRefresh()
  }
//刷新结束
})