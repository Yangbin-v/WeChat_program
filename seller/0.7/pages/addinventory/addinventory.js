// pages/addinventory/addinventory.js
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
    goodnumber: 0,
    goods: [],
    select_shelve: {},
    man: {},
    logtxt: '',
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
          region: res.data,
          man: app.globalData.userInfo,
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
    shelves.count().then(res=>{
      var shelve_count = res.total
      var times = Math.ceil(shelve_count / 20)
      var that = this
      async function loop() {
        var tmp = []
        for (var i = 0; i < times; i++) {
          await shelves.skip(i*20).limit(20).get().then(res => {
            tmp =  tmp.concat(res.data)
          })
        }
        return tmp
      }
      loop().then((result)=>{
        this.data.shelve = result
        console.log(this.data.shelve)
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
      goods: [],
      allgoods: []
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
    this.getgoods(shelveid)
  },

  getgoods: function(shelveid) {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const wares = db.collection('shelve_goods').where({
      shelve: shelveid
    })
    wares.count().then(res=>{
      var shelve_count = res.total
      var times = Math.ceil(shelve_count / 20)
      async function loop() {
        var tmp = []
        for (var i = 0; i < times; i++) {
          await wares.skip(i * 20).limit(20).get().then(res => {
            tmp =  tmp.concat(res.data)
          })
        }
        return tmp
      }
      loop().then((result)=>{
        for (var i of result[0].goods) {
          i.pandian = i.nownumber;
        }
        this.setData({
          goods:[].concat(result[0].goods),
          allgoods: result[0].goods,
          goodnumber: result[0].goods.length,
        })
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

  inputchange: function (e) {
    const number = e.detail.value
    const wgood = e.currentTarget.dataset.flag
    for (var i of this.data.goods) {
      if (wgood._id == i._id)
        i.pandian = number;
    }
  },

  inputlog: function (e) {
      this.data.logtxt = e.detail.value
  },

  updata: function() {
    if (this.data.goods.length == 0) {
      wx.showToast({
        title: '请选择货架',
        icon: "error",
        mask: true,
        duration: 1000
      })
      return;
    }
    for (var i of this.data.goods) {
      if (i.pandian == "") {
        wx.showToast({
          title: '请填入盘点数量',
          icon: "error",
          mask: true,
          duration: 1000
        })
        return;
      }
    }
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const coll = db.collection('shelve_inventory')
    var invent = 0.0;
    for (var i of this.data.goods) {
      var change = 0.0;
      var a = parseFloat(i.pandian) - parseFloat(i.nownumber)
      change = a * parseFloat(i.buy)
      i.inventory_buy = change
      invent += change
    }

    var nowdate = Date.now()
    var nowdate_ = new Date(parseInt(nowdate)) ; 
    nowdate =  nowdate_.getFullYear()+'/'+(nowdate_.getMonth()+1)+"/"+nowdate_.getDate()+' '+nowdate_.getHours()+':'+nowdate_.getMinutes()+':'+nowdate_.getSeconds()
    coll.add({
      data: {
        man: this.data.man.nickName,
        manimage: this.data.man.avatarUrl,
        due: nowdate,
        date: new Date(),
        note: this.data.logtxt,
        shelve: this.data.select_shelve,
        goods: this.data.goods,
        inventory_buy: invent
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
  
  Toshelvepath: function() {
    wx.navigateTo({
      url: '../ginout/ginout',
    })
  },
})
