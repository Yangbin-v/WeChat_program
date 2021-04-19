// pages/shelveout_del/shelveout_del.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    outgoods: [],
    shelve: {},
    logtxt: '',
    man: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    // 监听SentDataToOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('SentDataToOpenerPage', (res) => {
      this.setData({
        outgoods: res.data,
        shelve: res.shelve,
        man: app.globalData.userInfo
      })
    })
  },

  outlog: function (e) {
    this.setData({
      logtxt: e.detail.value
    })
  },

  deldata: function() {

    const shelve_id = this.data.shelve._id
    const cloud = app.cloud;
    const db = cloud.database()
    const _ = db.command
    const goods = db.collection('shelve_goods')
    for (var i of this.data.outgoods) {
      var it = goods.where({
        shelve: shelve_id
      }).update({
        data: {
          goods: _.pull({_id: i._id})
        }
      })
    }

    var goodslog = this.data.outgoods
    for (var j = 0; j < goodslog.length; j++) {
      goodslog[j].ware = "del"
    }
    const logcloud = db.collection('shelveoutlog')
    var nowdate = Date.now()
    var nowdate_ = new Date(parseInt(nowdate)) ; 
    nowdate =  nowdate_.getFullYear()+'/'+(nowdate_.getMonth()+1)+"/"+nowdate_.getDate()+' '+nowdate_.getHours()+':'+nowdate_.getMinutes()+':'+nowdate_.getSeconds()
    logcloud.add({
      data: {
        man: this.data.man.nickName,
        manimage: this.data.man.avatarUrl,
        due: nowdate,
        date: new Date(),
        note: this.data.logtxt,
        shelve: this.data.shelve,
        goods: goodslog
      }
    })

    setTimeout( function() {
      wx.showToast({
     title: '提交成功',
     icon: "success",
     mask: true,
     duration: 1000
   })
   },500);
   wx.navigateBack({
     delta: 2
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