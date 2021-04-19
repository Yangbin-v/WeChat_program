// pages/wareinout/wareinout.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ware: {},
    allgoods: [],
    goods: [],
    inputvalue: '',
    Ischeck: false,
    checknumber: 0,
    toppage: false,
    goodnumber: 0,
    goodname: '',
    goodid: '',
    outgoods: [],
    ischeckall: false,
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
    const cloud = app.cloud;
    const db = cloud.database()
    const wares = db.collection('goods') 
    wares.count().then(res=>{
      var that = this
      var goods_count = res.total
      var times = Math.ceil(goods_count / 20)
      async function loop() {
        var tmp = []
        for (var i = 0; i < times; i++) {
          await wares.orderBy('category', 'desc').skip(i * 20).limit(20).get().then(res => {
            tmp =  tmp.concat(res.data)
          })
        }
        return tmp
      }
      loop().then((result)=>{

        this.setData({
          allgoods: [].concat(result),
          goods: [].concat(result)
        })
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
    const cloud = app.cloud;
    const db = cloud.database()
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

  onloadall: function() {
    this.setData({
      goods: [],
      inputvalue: '',
      Ischeck: false,
      checknumber: 0,
      toppage: false,
      goodnumber: 0,
      goodname: '',
      goodid: '',
      outgoods: [],
      ischeckall: false,
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
    this.onloadall()
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
        that.onloadall()
        that.searchcode(res.result)
      }
    })
  },

  inputsearch: function (e) {
    console.log(e.detail.value)
    this.onloadall()
    this.setData({
      inputvalue: e.detail.value
    })
    this.searchgoods(this.data.inputvalue)
  },

  delete: function() {
    this.onloadall()
    this.setData({
      goods: [].concat(this.data.allgoods)
    })
  },

  searchgoods: function (e) {
    var reg = new RegExp('.*('+e+').*')
    for (var i of this.data.allgoods) {
      if (reg.test(i.name)) {
        this.data.goods.push(i)
      }
    }
    this.setData({
      goods: this.data.goods,
    })
  },

  searchcode: function (e) {
    const that = this
    let searchflag = false;
    for (var i of this.data.allgoods) {
      if (e == i.barcode) {
        this.data.goods.push(i)
        searchflag = true
      }
    }
    this.setData({
      goods: this.data.goods,
    })
      if (!searchflag) {
        wx.showModal({
          title: '',
          content: '新商品，是否添加',
          success (res) {
            if (res.confirm) {
              that.Toaddgood()
            } else if (res.cancel) {
              that.setData({
                goods: [].concat(that.data.allgoods)
              })
            }
          }
        })
      }
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

