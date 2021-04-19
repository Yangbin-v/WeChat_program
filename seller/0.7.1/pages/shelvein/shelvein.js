// pages/shelvein/shelvein.js
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
    outgoods: [],
    ware: {},
    numbervaule: {},
    man: '',
    region: [],
    shelve: [],
    inregion: '',
    inshelve: '',
    shelve_goods: {},
    shelvedata: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    // 监听SentDataToOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('SentDataToOpenerPage', (res) => {
      this.setData({
        outgoods: res.data,
        ware: res.ware
      })
      for (var item of this.data.outgoods) {
        this.data.numbervaule[item._id] = '0'
      }
      this.setData({
        numbervaule: this.data.numbervaule,
        man: app.globalData.userInfo
      })
      for (var i = 0; i < this.data.outgoods.length; i++) {
        this.data.outgoods[i].nownumber = '0';
      }
      this.setData({
        outgoods: this.data.outgoods
      })
    })
    this.getregion()
    wx.showToast({
      title: '请选择货架',
      icon: "success",
      mask: true,
      duration: 1000
    })
  },

  getregion: function() {
    const cloud = app.cloud;
    const db = cloud.database()
    const regions = db.collection('shelves_arae')
    regions.get().then(res => {
        this.setData({
          region: res.data
        })
        this.getshelve()
        
    })
  },

  getshelve: function() {
    const cloud = app.cloud;
    const db = cloud.database()
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
    this.data.customIndex = e.detail.value
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
      customIndex: e.detail.value,
      inregion: this.data.array[0][this.data.customIndex[0]],
      inshelve: this.data.array[1][this.data.customIndex[1]]
    })

    var shelveid = this.data.region[this.data.customIndex[0]].shelve[this.data.customIndex[1]]._id
    this.data.shelvedata = this.data.region[this.data.customIndex[0]].shelve[this.data.customIndex[1]]
    const cloud = app.cloud;
    const db = cloud.database()
    const shelves = db.collection('shelve_goods')
    shelves.where({
      shelve: shelveid
    }).get().then(res => {
      this.setData({
        shelve_goods: res.data[0]
      })
      for (var i = 0; i < this.data.outgoods.length; i++) 
        for (var j = 0; j < this.data.shelve_goods.goods.length; j++) {
          if (this.data.outgoods[i]._id == this.data.shelve_goods.goods[j]._id)
            this.data.outgoods[i].nownumber = this.data.shelve_goods.goods[j].nownumber
        }
      this.setData({
        outgoods: this.data.outgoods
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

  numberchnage: function (e) {
    let inputvalue =  e.detail.value
    let id = e.currentTarget.dataset.id
    if (parseInt(inputvalue) > parseInt(id.ware[this.data.ware['_id']])) {
      this.data.numbervaule[id._id] = id.ware[this.data.ware['_id']]
      this.setData({
        numbervaule: this.data.numbervaule
      })
      wx.showToast({
        title: '不能超过库存',
        icon: "error",
        mask: true,
        duration: 1000
      })
    }
    else {
      this.data.numbervaule[id._id] = inputvalue
      this.setData({
        numbervaule: this.data.numbervaule
      })
    }
  },

  increase: function (e) {
    let id = e.currentTarget.dataset.id
    if (parseInt(this.data.numbervaule[id._id]) == parseInt(id.ware[this.data.ware['_id']])) {
      wx.showToast({
        title: '不能超过库存',
        icon: "error",
        mask: true,
        duration: 1000
      })
    }
    else if(this.data.numbervaule[id._id] == '') {
      this.data.numbervaule[id._id] = '0'
      this.setData({
        numbervaule: this.data.numbervaule
      })
    }
    else {
      this.data.numbervaule[id._id] = parseInt(this.data.numbervaule[id._id]) + 1 + ''
      this.setData({
        numbervaule: this.data.numbervaule
      })
    }
  },

  reduce: function (e) {
    let id = e.currentTarget.dataset.id
    if (parseInt(this.data.numbervaule[id._id]) == 0) {
      //不能为负值
    }
    else if(this.data.numbervaule[id._id] == '') {
      this.data.numbervaule[id._id] = '0'
      this.setData({
        numbervaule: this.data.numbervaule
      })
    }
    else {
      this.data.numbervaule[id._id] = parseInt(this.data.numbervaule[id._id]) - 1 + ''
      this.setData({
        numbervaule: this.data.numbervaule
      })
    }
  },

  updata: function() {
    if (this.data.inshelve == '') {
      wx.showToast({
        title: '请选择货架',
        icon: "error",
        mask: true,
        duration: 1000
      })
      return;
    }
    const cloud = app.cloud;
    const db = cloud.database()
    const _ = db.command
    const shelve_goods = db.collection('shelve_goods').doc(this.data.shelve_goods._id)
    for (var i = 0; i < this.data.outgoods.length; i++) {
      var flag = 0
      for (var j = 0; j < this.data.shelve_goods.goods.length; j++) {
        if (this.data.outgoods[i]._id == this.data.shelve_goods.goods[j]._id) {
          flag = 1
          shelve_goods.update({
            data: {
              ['goods.'+[j]]: {
                nownumber: parseInt(this.data.shelve_goods.goods[j].nownumber) + parseInt(this.data.numbervaule[this.data.outgoods[i]._id]) + ''
              }
            }
          })
        }
      }
      if (flag == 0) {
        var adddata = Object.assign({}, this.data.outgoods[i])
        delete adddata.ware
        adddata.nownumber = parseInt(adddata.nownumber) + parseInt(this.data.numbervaule[this.data.outgoods[i]._id]) + ''
        this.data.outgoods[i].nownumber = '0'
        shelve_goods.update({
          data: {
            goods: _.push(adddata)
          }
        })
      }
    }

    var goodslog = this.data.outgoods
    for (var j = 0; j < goodslog.length; j++) {
      goodslog[j].ware = this.data.numbervaule[goodslog[j]._id]
    }
    const logcloud = db.collection('shelveinlog')
    var nowdate = Date.now()
    var nowdate_ = new Date(parseInt(nowdate)) ; 
    nowdate =  nowdate_.getFullYear()+'/'+(nowdate_.getMonth()+1)+"/"+nowdate_.getDate()+' '+nowdate_.getHours()+':'+nowdate_.getMinutes()+':'+nowdate_.getSeconds()
    logcloud.add({
      data: {
        man: this.data.man.nickName,
        manimage: this.data.man.avatarUrl,
        due: nowdate,
        date: new Date(),
        ware: this.data.ware,
        shelve: this.data.shelvedata,
        goods: goodslog
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