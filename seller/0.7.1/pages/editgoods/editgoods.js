// pages/editgoods/editgoods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editor: {},
    imagepath: '',
    array: [],
    allkinds: [],
    category: '',
    imageurl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    // 监听SentDataToOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('SentDataToOpenerPage', (res) => {
      this.setData({
        editor: res.data,
        category: res.data.category,
        imageurl: res.data.url
      })
    })
    this.getkinds()
  },

  backvalue: function (e) {
    if (e.detail.value.name&&e.detail.value.price&&e.detail.value.buy) {
      const cloud = app.cloud;
      const db = cloud.database()
      db.collection('goods').doc(this.data.editor._id).update({
        data: {
          name: e.detail.value.name,
          barcode: e.detail.value.barcode,
          category: this.data.array[e.detail.value.category],
          price: e.detail.value.price,
          buy: e.detail.value.buy,
          url: this.data.imageurl,
          note: e.detail.value.note
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

  delete: function () {
    const cloud = app.cloud;
    const db = cloud.database()
    db.collection('goods').doc(this.data.editor._id).remove()
    setTimeout( function() {
      wx.showToast({
        title: '删除成功',
        icon: "success",
        mask: true,
        duration: 1000
      })
    },500);
    wx.navigateBack({
      delta: 1
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
        that.setData({
          imagepath: tempFilePaths
        });
        let cloudPath = 'goodsimage/' + Date.now() + '.jpg';
        cloud.uploadFile({
          cloudPath,
          filePath: that.data.imagepath
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

  getkinds: function() {
    const cloud = app.cloud;
    const db = cloud.database()
    const wares = db.collection('kinds')
    wares.get().then(res => {
      this.setData({
        allkinds: res.data
      })
      for (var value of this.data.allkinds) {
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