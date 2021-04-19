// pages/addgood/addgood.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    allkinds: [],
    category: '',
    imageurl: '',
    allware: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getkinds()
    this.getwares()
  },

  backvalue: function (e) {
    var warenumber = new Object()
    for (var evware of this.data.allware) {
      warenumber[evware._id] = '0'
    }
    if (e.detail.value.name&&e.detail.value.price&&e.detail.value.buy&&e.detail.value.category) {
      const cloud = app.cloud;
      const db = cloud.database()
      db.collection('goods').add({
        data: {
          name: e.detail.value.name,
          barcode: e.detail.value.barcode,
          category: this.data.array[e.detail.value.category],
          price: e.detail.value.price,
          buy: e.detail.value.buy,
          url: this.data.imageurl,
          note: e.detail.value.note,
          ware: warenumber
        }
      })
      setTimeout( function() {
         wx.showToast({
        title: '修改成功',
        icon: "success",
        mask: true,
        duration: 1000
      })
      },500);
      wx.navigateBack({
        delta: 1
      })
    }
    else {
      wx.showToast({
        title: '必填项不能为空',
        image: "/images/warning.png",
        mask: true,
        duration: 2000
      })
    }
},

getwares: function() {
  const cloud = app.cloud;
  const db = cloud.database()
  const wares = db.collection('wares')
  wares.get().then(res => {
  this.setData({
    allware: res.data
  })
})
},

  getkinds: function() {
    const cloud = app.cloud;
    const db = cloud.database()
    const wares = db.collection('kinds')
    wares.get().then(res => {
      this.setData({
        allkinds: res.data
      })
      for (var value of this.data.allkinds) {
        console.log(value);
        this.data.array.push(value.name)
      }
      this.setData({
        array: this.data.array
      })
    })
  },

  kindchange: function(e) {
    this.setData({
      category: this.data.array[e.detail.value]
    })
  },

  upgoodimage: function() {
    const that = this
    const cloud = app.cloud;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        const tempFilePaths = res.tempFilePaths[0]
        const imagepath = tempFilePaths
        let cloudPath = 'goodsimage/' + Date.now() + '.jpg';
        cloud.uploadFile({
          cloudPath,
          filePath: imagepath
        }).then((res)=>{
          let fileID = res.fileID;
          if(fileID){
            that.setData({
              imageurl: fileID
             });
          }
        })
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