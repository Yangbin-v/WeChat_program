// pages/goodsin/goodsin.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    outgoods: [],
    ware: {},
    numbervaule: {},
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
        ware: res.ware
      })
      for (var item of this.data.outgoods) {
        this.data.numbervaule[item._id] = '0'
      }
      this.setData({
        numbervaule: this.data.numbervaule,
        man: app.globalData.userInfo
      })
    })
  },

  numberchnage: function (e) {
    let inputvalue =  e.detail.value
    let id = e.currentTarget.dataset.id
    if (parseInt(inputvalue) > 999) {
      this.data.numbervaule[id._id] = '999'
      this.setData({
        numbervaule: this.data.numbervaule
      })
      wx.showToast({
        title: '不能超过999',
        icon: "error",
        mask: true,
        duration: 1000
      })
    }
    else {
      this.data.numbervaule[id._id] = inputvalue
      this.setData({
        numbervaule: this.data.numbervaule
      })
    }
  },

  increase: function (e) {
    let id = e.currentTarget.dataset.id
    if (parseInt(this.data.numbervaule[id._id]) == 999) {
      wx.showToast({
        title: '不能超过999',
        icon: "error",
        mask: true,
        duration: 1000
      })
    }
    else if(this.data.numbervaule[id._id] == '') {
      this.data.numbervaule[id._id] = '0'
      this.setData({
        numbervaule: this.data.numbervaule
      })
    }
    else {
      this.data.numbervaule[id._id] = parseInt(this.data.numbervaule[id._id]) + 1 + ''
      this.setData({
        numbervaule: this.data.numbervaule
      })
    }
  },

  reduce: function (e) {
    let id = e.currentTarget.dataset.id
    if (parseInt(this.data.numbervaule[id._id]) == 0) {
      //不能为负值
    }
    else if(this.data.numbervaule[id._id] == '') {
      this.data.numbervaule[id._id] = '0'
      this.setData({
        numbervaule: this.data.numbervaule
      })
    }
    else {
      this.data.numbervaule[id._id] = parseInt(this.data.numbervaule[id._id]) - 1 + ''
      this.setData({
        numbervaule: this.data.numbervaule
      })
    }
  },

  outlog: function (e) {
    this.setData({
      logtxt: e.detail.value
    })
  },

  updata: function() {
    const ware_id = this.data.ware._id
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const goods = db.collection('goods')
    for (var i of this.data.outgoods) {
      var it = goods.doc(i._id).update({
        data: {
          ware: {
            [ware_id]: parseInt(i.ware[ware_id]) + parseInt(this.data.numbervaule[i._id]) + ''
          }
        }
      })
    }

    var goodslog = this.data.outgoods
    for (var j = 0; j < goodslog.length; j++) {
      goodslog[j].ware = this.data.numbervaule[goodslog[j]._id]
    }
    var nowdate = Date.now()
    var nowdate_ = new Date(parseInt(nowdate)) ; 
    nowdate =  nowdate_.getFullYear()+'/'+(nowdate_.getMonth()+1)+"/"+nowdate_.getDate()+' '+nowdate_.getHours()+':'+nowdate_.getMinutes()+':'+nowdate_.getSeconds()
    const logcloud = db.collection('goodsinlog')
    logcloud.add({
      data: {
        man: this.data.man.nickName,
        manimage: this.data.man.avatarUrl,
        due: nowdate,
        date: new Date(),
        note: this.data.logtxt,
        ware: this.data.ware,
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