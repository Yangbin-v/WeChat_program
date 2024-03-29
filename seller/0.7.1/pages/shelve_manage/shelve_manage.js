// pages/ware_manage/ware_manage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   region: {},
   shelveresult: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    // 监听SentDataToOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('SentDataToOpenerPage', (res) => {
      this.setData({
        region: res.data
      })
      this.getresult()
    })
  },

  Toeditpath: function(event) {
    var editdata = event.currentTarget.dataset.post;
    wx.navigateTo({
      url: '../editshelve/editshelve',
      success: (res) =>{
      // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('SentDataToOpenerPage', {data: editdata})
     }
    })
  },
  Toregionpath: function() {
    wx.navigateTo({
      url: '../editregion/editregion',
      success: (res) =>{
      // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('SentDataToOpenerPage', {data: this.data.region})
     }
    })
  },
  Toaddpath: function(event) {
    wx.navigateTo({
      url: '../addshelve/addshelve',
      success: (res) =>{
        // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('SentDataToOpenerPage', {data: this.data.region})
       }
    })
  },
  getresult: function() {
    const cloud = app.cloud;
    const db = cloud.database()
    const wares = db.collection('shelve') 
    wares.count().then(res=>{
      var that = this
      var count = res.total
      var times = Math.ceil(count / 20)
      async function loop() {
        var tmp = []
        for (var i = 0; i < times; i++) {
          await wares.where({
            region: that.data.region._id
          }).skip(i * 20).limit(20).get().then(res => {
            tmp =  tmp.concat(res.data)
          })
        }
        return tmp
      }
      loop().then((result)=>{

        this.setData({
          shelveresult: [].concat(result)
        })
      })
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
    this.data.shelveresult = []
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