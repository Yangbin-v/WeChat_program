// pages/kindpage/kindpage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kind: {},
    goods: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    // 监听SentDataToOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('SentDataToOpenerPage', (res) => {
      this.data.kind = res.data
      this.daohang(this.data.kind)
      this.getgoods(this.data.kind)
    })
    
  },

  daohang: function (kind) {
    wx.setNavigationBarTitle({
      title: kind.name 
    })
  },

  getgoods: function(e) {
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
          await wares.where({
            category: e.name
          }).skip(i * 20).limit(20).get().then(res => {
            tmp =  tmp.concat(res.data)
          })
        }
        return tmp
      }
      loop().then((result)=>{

        this.setData({
          goods: [].concat(result)
        })
      })
    })
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