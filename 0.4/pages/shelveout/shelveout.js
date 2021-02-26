// pages/shelveout/shelveout.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customIndex: [0, 0],
    array: [
      [],
      []
    ],
    region: [],
    shelve: [],
    inregion: '',
    inshelve: '',
    shelve_id: '',
    //
    shelve_goods: {},
    goods: [],
    Ischeck: false,
    checknumber: 0,
    outgoods: [],
    select_shelve: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getregion()
  },

  getregion: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const regions = db.collection('shelves_arae')
    regions.get().then(res => {
        this.setData({
          region: res.data
        })
        this.getshelve()
    })
  },

  getshelve: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const shelves = db.collection('shelve')
    shelves.where({}).get().then(res => {
      this.setData({
        shelve: res.data
      })
      for (var i = 0; i < this.data.region.length; i++) {
        this.data.region[i].shelve = []
        for (var j = 0; j < this.data.shelve.length; j++) {
          if (this.data.shelve[j].region == this.data.region[i]._id) {
            this.data.region[i].shelve.push(this.data.shelve[j])
          }
        }
      }
      for (var i = 0; i < this.data.region.length; i++) {
        this.data.array[0].push(this.data.region[i].name)
      }
      for (var j = 0; j < this.data.region[0].shelve.length; j++) {
        this.data.array[1].push(this.data.region[0].shelve[j].name);
      }
      this.setData({
        array: this.data.array
      })
    })
  },

  bindPickerChange: function(e) {
    if (this.data.region[e.detail.value[0]].shelve.length == 0) {
      wx.showToast({
        title: '请选择货架',
        icon: "error",
        mask: true,
        duration: 1000
      })
      return;
    }
    this.setData({
      shelve_goods: {},
      goods: [],
      outgoods: []
    })
    this.data.customIndex = e.detail.value
    this.setData({
      customIndex: e.detail.value,
      inregion: this.data.array[0][this.data.customIndex[0]],
      inshelve: this.data.array[1][this.data.customIndex[1]]
    })
    this.data.select_shelve = this.data.region[this.data.customIndex[0]].shelve[this.data.customIndex[1]]
    var shelveid = this.data.select_shelve._id
    this.data.shelve_id = shelveid
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const shelves = db.collection('shelve_goods')
    shelves.where({
      shelve: shelveid
    }).get().then(res => {
      this.setData({
        shelve_goods: res.data[0],
        goods: res.data[0].goods
      })
    })
  },

  bindPickerColumnChange: function(e) {
    var region = this.data.region,
      customIndex = this.data.customIndex,
      array = this.data.array;

    customIndex[e.detail.column] = e.detail.value;
    console.log(customIndex);

    var searchColumn = () => {
      for (var i = 0; i < region.length; i++) {
        var arr1 = [];
        if (i == customIndex[0]) {
          for (var j = 0; j < region[i].shelve.length; j++) {
            arr1.push(region[i].shelve[j].name);
          }
          array[1] = arr1;
        }
      };
    }
    switch (e.detail.column) {
      case 0:
        customIndex[1] = 0;
        searchColumn();
        break;
      case 1:
        break;
    }
    this.setData({
      array: array,
      customIndex: customIndex
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

  Toshelveout_path: function() {
    if (this.data.inshelve == '') {
      wx.showToast({
        title: '请选择货架',
        icon: "error",
        mask: true,
        duration: 1000
      })
      return;
    }
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
      url: '../shelveout_/shelveout_',
      success: (res) =>{
      // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('SentDataToOpenerPage', 
        {
          data: this.data.outgoods,
          shelve: this.data.select_shelve
        })
     }
    })
  },

  Toshelvedel_path: function() {
    if (this.data.inregion == '') {
      wx.showToast({
        title: '请选择货架',
        icon: "error",
        mask: true,
        duration: 1000
      })
      return;
    }
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
      url: '../shelveout_del/shelveout_del',
      success: (res) =>{
      // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('SentDataToOpenerPage', 
        {
          data: this.data.outgoods,
          shelve: this.data.select_shelve
        })
     }
    })
  },

  Toshelvepath: function() {
    wx.navigateTo({
      url: '../ginout/ginout',
    })
  },
})
