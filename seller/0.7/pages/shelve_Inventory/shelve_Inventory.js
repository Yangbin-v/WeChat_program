// pages/shelve_Inventory/shelve_Inventory.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: [],
    in: [],
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getdata()
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
    this.data.customIndex = e.detail.value
    this.setData({
      customIndex: e.detail.value,
      inregion: this.data.array[0][this.data.customIndex[0]],
      inshelve: this.data.array[1][this.data.customIndex[1]]
    })

    var shelveid = this.data.region[this.data.customIndex[0]].shelve[this.data.customIndex[1]]._id
    this.data.shelve_id = shelveid
    this.data.datas = []
    for (var i = 0; i < this.data.in.length; i++) {
      if (this.data.in[i].shelve._id == shelveid) {
        this.data.datas.push(this.data.in[i])
      }
    }
    this.setData({
      datas: this.data.datas,
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


  getdata: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const wares = db.collection('shelve_inventory') 
    wares.count().then(res=>{
      var that = this
      var shelve_count = res.total
      var times = Math.ceil(shelve_count / 20)
      async function loop() {
        var tmp = []
        for (var i = 0; i < times; i++) {
          await wares.orderBy('date', 'desc').skip(i * 20).limit(20).get().then(res => {
            tmp =  tmp.concat(res.data)
          })
        }
        return tmp
      }
      loop().then((result)=>{

        this.setData({
          in: result,
          datas: result,
        })
      })
    })
  },

  Toinventory: function() {
      wx.navigateTo({
        url: '../addinventory/addinventory'
      })
      setTimeout( function() {
        wx.showToast({
          title: '选择货架',
          icon: "success",
          mask: true,
          duration: 800
        })
      },500);
  },

  Toinventorydetail: function(e) {
    wx.navigateTo({
      url: '../inventorydetail/inventorydetail',
      success: (res) =>{
        // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('SentDataToOpenerPage', {data: e.currentTarget.dataset.i})
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