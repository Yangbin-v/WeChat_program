// pages/shelve_view/shelve_view.js
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
    inshelve: '全部',
    shelve_id: '',
    //
    shelve_goods: {},
    goods: [],
    shelve_goods_sum: 0,
    shelve_goods_value: 0,
    shelve_goods_buy: 0,
    shelve_goods_0: 0,
    switchflag_1: false,
    switchflag_2: false,
    allshelve_goods: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getregion()
    this.getallgoods()
  },

  getallgoods: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const allshelve_goods = db.collection('shelve_goods')
    allshelve_goods.get().then(res => {
      this.data.allshelve_goods = res.data
      this.data.shelve_goods = Object.assign({}, res.data[0])
      for (var u = 1; u < this.data.allshelve_goods.length; u++) {
        for (var i = 0; i < this.data.allshelve_goods[u].goods.length; i++) {
          var flag = true
          for (var j = 0; j < this.data.shelve_goods.goods.length; j++) {
            if (this.data.allshelve_goods[u].goods[i]._id == this.data.shelve_goods.goods[j]._id) {
              var ii = parseInt(this.data.allshelve_goods[u].goods[i].nownumber)
              var jj = parseInt(this.data.shelve_goods.goods[j].nownumber)
              ii = ii + jj
              this.data.shelve_goods.goods[j].nownumber = ii + ''
              flag = false
            }
          }

          if (flag == false) {
            this.data.shelve_goods.goods.concat([this.data.allshelve_goods[u].goods[i]])
          }
        }
      }
      var sum = 0
      var sumvalue = 0
      var num0 = 0
      var buyvalue = 0
      for (var i of this.data.shelve_goods.goods) {
        sum = sum + parseInt(i.nownumber)
        sumvalue = sumvalue + parseFloat(i.nownumber)*parseFloat(i.price)
        buyvalue = buyvalue + parseFloat(i.nownumber)*parseFloat(i.buy)
        if (parseInt(i.nownumber) == 0)
          num0++
      }
      this.setData({
        shelve_goods_sum: sum,
        shelve_goods_value: sumvalue,
        shelve_goods_0: num0,
        shelve_goods_buy: buyvalue,
        goods: [].concat(this.data.shelve_goods.goods)
      })
  })
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
      var sum = 0
      var sumvalue = 0
      var num0 = 0
      var buyvalue = 0
      for (var i of res.data[0].goods) {
        sum = sum + parseInt(i.nownumber)
        sumvalue = sumvalue + parseFloat(i.nownumber)*parseFloat(i.price)
        buyvalue = buyvalue + parseFloat(i.nownumber)*parseFloat(i.buy)
        if (parseInt(i.nownumber) == 0)
          num0++
      }
      this.setData({
        shelve_goods: res.data[0],
        goods: [].concat(res.data[0].goods),
        shelve_goods_sum: sum,
        shelve_goods_value: sumvalue,
        shelve_goods_0: num0,
        shelve_goods_buy: buyvalue,
        switchflag_1: false,
        switchflag_2: false
      })
    })
  },

  bindPickerColumnChange: function(e) {
    var region = this.data.region,
      customIndex = this.data.customIndex,
      array = this.data.array;

    customIndex[e.detail.column] = e.detail.value;

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

  switch_1: function(e) {
    this.data.switchflag_1 = e.detail.value
    if (this.data.switchflag_2==true&&e.detail.value==true) {
      this.setData({
        switchflag_1: false
      })
      wx.showToast({
        title: '请关闭只显示',
        icon: "error",
        mask: true,
        duration: 1000
      })
      return;
    }
    if (e.detail.value&&Object.keys(this.data.shelve_goods).length != 0) {
      for (var i = 0; i < this.data.goods.length; i++) {
        console.log(parseInt(this.data.goods[i].nownumber))
        if (parseInt(this.data.goods[i].nownumber) == 0) {
          this.data.goods.splice(i,1)
          i--
        }
      }
    }
    else {
      this.data.goods = [].concat(this.data.shelve_goods.goods)
      if (this.data.goods[0] == null)
        this.data.goods = []
    }
    this.setData({
      goods: this.data.goods
    })
  },

  switch_2: function(e) {
    this.data.switchflag_2 = e.detail.value
    if (this.data.switchflag_1==true&&e.detail.value==true) {
      this.setData({
        switchflag_2: false
      })
      wx.showToast({
        title: '请关闭不显示',
        icon: "error",
        mask: true,
        duration: 1000
      })
      return;
    }
    if (e.detail.value&&Object.keys(this.data.shelve_goods).length != 0) {
      for (var i = 0; i < this.data.goods.length; i++) {
        if (parseInt(this.data.goods[i].nownumber) != 0) {
          this.data.goods.splice(i,1)
          i--
        }
      }
    }
    else {
      this.data.goods = [].concat(this.data.shelve_goods.goods)
      if (this.data.goods[0] == null)
        this.data.goods = []
    }
    this.setData({
      goods: this.data.goods
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
})
