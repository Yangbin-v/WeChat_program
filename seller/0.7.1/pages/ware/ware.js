// pages/ware/ware.js
//获取应用实例
import * as myreact from '../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wareresult: [],
    iconid: [
      "cloud://mysql-9gg2dnlgdb0e3042.6d79-mysql-9gg2dnlgdb0e3042-1305244399/iconimage/仓库.png",
      "cloud://mysql-9gg2dnlgdb0e3042.6d79-mysql-9gg2dnlgdb0e3042-1305244399/iconimage/箭头.png"
    ],
    iconurl: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getresult()
    this.geticonurl()
  },

  geticonurl: function() {
    myreact.getIconURL('ware', this.data.iconid).then(res=>{
      this.setData({
        iconurl: res
      })
    })
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
  getresult: async function() {
    const cloud = app.cloud;
    const db = cloud.database();
    const wares = db.collection('wares');
    wares.get().then(res => {
    this.setData({
      wareresult: res.data
    })
  });
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