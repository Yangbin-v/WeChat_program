// pages/goodmanage/goodmanage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageflag: true,
    goods: [],
    kinds: [],
    inputvalue: '',
    toppage: false,
    kindpage: false,
    del_kind: {},
    allgoods: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getgoods()
    this.getkinds()
  },

  onloadall: function() {
    this.setData({
      goods: [],
      inputvalue: '',
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

  delete: function() {
    this.onloadall()
    this.setData({
      goods: [].concat(this.data.allgoods)
    })
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

  Tokindpage: function (event) {
    var kind = event.currentTarget.dataset.post;
    wx.navigateTo({
      url: '../kindpage/kindpage',
      success: (res) =>{
      // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('SentDataToOpenerPage', {data: kind})
     }
    })
  },

  getgoods: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
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
          goods: [].concat(result),
          allgoods: [].concat(result)
        })
      })
    })
  },


  getkinds: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const wares = db.collection('kinds')
    wares.get().then(res => {
      this.setData({
        kinds: res.data
      })
    })
  },

  deletepage: function(e) {
    this.setData({
      kindpage: true
    })
    var delkind = e.currentTarget.dataset.delekind;
    this.setData({
      del_kind: delkind
    })
  },

  deletekind: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    db.collection('kinds').doc(this.data.del_kind._id).remove()
    db.collection('goods').where({
      category: this.data.del_kind.name
    }).remove()
    this.setData({
      kindpage: false
    })
    setTimeout( function() {
      wx.showToast({
        title: '删除成功',
        icon: "success",
        mask: true,
        duration: 1000
      })
    },500);
    this.getgoods()
    this.getkinds()
    app.onRefresh()
  },
  toeditgood:function(event) {
    var edgood = event.currentTarget.dataset.edgood;
    wx.navigateTo({
      url: '../editgoods/editgoods',
      success: (res) =>{
      // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('SentDataToOpenerPage', {data: edgood})
     }
    })
  },

  Toaddgood:function() {
    wx.navigateTo({
      url: '../addgood/addgood'
    })
  },

  switchpage1: function() {
    var that = this
    this.setData({
      pageflag: true
    })
  },
  switchpage2: function() {
    var that = this
    this.setData({
      pageflag: false
    })
  },

  ftoppage: function() {
    this.setData({
      toppage: true
    })
  },

  addkindpage:function(e) {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    db.collection('kinds').add({
      data: {
        name: e.detail.value.kind
      }
    })
    this.setData({
      toppage: false
    })
    setTimeout( function() {
      wx.showToast({
        title: '增加成功',
        icon: "success",
        mask: true,
        duration: 1000
      })
    },500);
    this.getgoods()
    this.getkinds()
    app.onRefresh()
  },

  quxi: function() {
    this.setData({
      toppage: false
    })
    this.setData({
      kindpage: false
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