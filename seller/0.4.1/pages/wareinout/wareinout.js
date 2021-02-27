// pages/wareinout/wareinout.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ware: {},
    goods: [],
    inputvalue: '',
    Ischeck: false,
    checknumber: 0,
    toppage: false,
    goodnumber: 0,
    goodname: '',
    goodid: '',
    outgoods: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const eventChannel = this.getOpenerEventChannel()
    // 监听SentDataToOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('SentDataToOpenerPage', (res) => {
      this.setData({
        ware: res.data
      })
      this.getgoods()
    })
  },
  getgoods: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const wares = db.collection('goods')
    wares.get().then(res => {
    this.setData({
      goods: res.data
    })
  })
  },

  ftoppage: function(e) {
    var editgood = e.currentTarget.dataset.good
    this.setData({
      toppage: true,
      goodnumber: editgood.ware[this.data.ware._id],
      goodname: editgood.name,
      goodid: editgood._id
    })
  },

  editnumber:function(e) {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    db.collection('goods').doc(this.data.goodid).update({
      data: {
        ware: {
          [this.data.ware._id]: e.detail.value.newnumber
        }
      }
    })
    this.setData({
      toppage: false
    })
    setTimeout( function() {
      wx.showToast({
        title: '修改成功',
        icon: "success",
        mask: true,
        duration: 1000
      })
    },500);
  },

  quxi: function() {
    this.setData({
      toppage: false
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
    this.getgoods()
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

  },
  phonescan: function () {
    var that = this;
    wx.scanCode({
      success (res) {
        console.log(res)
        that.searchcode(res.result)
      }
    })
  },

  inputsearch: function (e) {
    console.log(e.detail.value)
    this.setData({
      inputvalue: e.detail.value
    })
    this.searchgoods(this.data.inputvalue)
  },

  delete: function() {
    var _this=this
    setTimeout(function () {
      _this.setData({
        inputvalue: ''
      })
      _this.searchgoods(_this.data.inputvalue)
  },100)
  },

  searchgoods: function (e) {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const _ = db.command
    const wares = db.collection('goods')
    var reg = new RegExp('.*('+e+').*')
    wares.where(_.or([
      {
        barcode: e
      },
      {
        name: reg
      }
    ]).and(
      {
        ware: this.data.ware._id
      }
    )).get().then(res => {
      this.setData({
        goods: res.data
      })
  })
  },

  searchcode: function (code) {
    var that = this;
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const wares = db.collection('goods') 
    wares.where({
      barcode: code
    }).get().then(res => {
      if (res.data.length != 0) {
        this.setData({
          goods: res.data
        })
      }
      else {
        wx.showModal({
          title: '!',
          content: '新商品，是否添加',
          success (res) {
            if (res.confirm) {
              that.Toaddgood()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
  })
  },

  Toeditgooodspath: function(e) {
    wx.navigateTo({
      url: '../editgoods/editgoods',
      success: (res) =>{
      // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('SentDataToOpenerPage', {data: e})
     }
    })
  },

  checkall: function() {
    if (this.data.checknumber==this.data.goods.length) {
      this.data.checknumber = 0
      this.setData({
        Ischeck: false,
        checknumber: this.data.checknumber,
        outgoods: []
      })
    }
    else {
      this.data.checknumber = this.data.goods.length
      this.setData({
        Ischeck: true,
        checknumber: this.data.checknumber,
        outgoods: [].concat(this.data.goods)
      })
    }
  },

  checkchange: function(e) {
    if (e.detail.value.length == 1) {
      this.data.outgoods.push(e.currentTarget.dataset.post)
      this.setData({
        checknumber: this.data.checknumber + 1,
        outgoods: this.data.outgoods
      })
      if (this.data.checknumber == this.data.goods.length) {
        this.setData({
          ischeckall: true,
          Ischeck: true
        })
      }
    }
    else {
      this.setData({
        checknumber: this.data.checknumber - 1,
        ischeckall: false
      })
      for (var i = 0; i < this.data.outgoods.length; i++) {
        if (this.data.outgoods[i]._id == e.currentTarget.dataset.post._id)
          this.data.outgoods.splice(i,1)
      }
      this.setData({
        outgoods: this.data.outgoods
      })
    }

  },

  Togooodsoutpath: function() {
    if (this.data.outgoods.length == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: "error",
        mask: true,
        duration: 1000
      })
      return;
    }
    wx.navigateTo({
      url: '../goodsout/goodsout',
      success: (res) =>{
      // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('SentDataToOpenerPage', 
        {
          data: this.data.outgoods,
          ware: this.data.ware
        })
     }
    })
  },

  Togooodsinpath: function() {
    if (this.data.outgoods.length == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: "error",
        mask: true,
        duration: 1000
      })
      return;
    }
    wx.navigateTo({
      url: '../goodsin/goodsin',
      success: (res) =>{
      // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('SentDataToOpenerPage', 
        {
          data: this.data.outgoods,
          ware: this.data.ware
        })
     }
    })
  },

  Toshelveinpath: function() {
    if (this.data.outgoods.length == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: "error",
        mask: true,
        duration: 1000
      })
      return;
    }
    wx.navigateTo({
      url: '../shelvein/shelvein',
      success: (res) =>{
      // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('SentDataToOpenerPage', 
        {
          data: this.data.outgoods,
          ware: this.data.ware
        })
     }
    })
  },

  Toinoutdetailpath: function() {
    wx.navigateTo({
      url: '../inoutdetail/inoutdetail',
      success: (res) =>{
        // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('SentDataToOpenerPage', 
          {
            ware: this.data.ware
          }
          )
       }
    })
  },
})

