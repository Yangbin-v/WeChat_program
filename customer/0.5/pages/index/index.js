var base = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isHide: true,
    goods: [],
    kinds: [],
    goodsSelected: [],
    curId: 0,
  },

  scancode: function () {
       wx.scanCode({
         success: (res) => {
           console.log(res);
           if (res.result){
             this.getgoods(res.result);
             this.getkinds();
           }else{
             wx.showToast({
               title: '请重新扫描！',
               icon: 'error',
             })
             return false;
           }
         },fail:(res)=>{
           wx.showToast({
             title: '失败，请重试！',
             icon: 'error',
           })
         }
       })
     },
  onGotUserInfo:function (e) {//授权登陆
    const { userInfo } = e.detail
    this.setData({
        userInfo: userInfo
    })
},
onLoad: function () {
  var that = this
  //调用应用实例的方法获取全局数据
  base.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
          userInfo: userInfo
      })
  })
},
onShow: function (){
  var that = this
  //调用应用实例的方法获取全局数据
  base.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
          userInfo: userInfo
      })
  })
},
  onPullDownRefresh: function() {
    base.onRefresh()
  },

  getgoods: function(e) {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const wares = db.collection('shelve_goods').where({_id: e})

    wares.get().then(res => {
      if(res.data.length==0)
      {
        wx.showToast({
          title: '二维码错误，请重新扫描！',
          icon: 'error',
        })
        return false;
      }
      const g=res.data[0].goods
      this.setData({
        goods: g.sort(this.compare("category")),
        goodsSelected: g.sort(this.compare("category")),
        isHide: false
      })
    })
  },

  getkinds: function() {
    wx.cloud.init({
      env: "test-6gbfgwps390db2f7"//默认云开发环境配置
    })
    const db = wx.cloud.database()
    const wares = db.collection('kinds').where({}).orderBy('name', 'asc')
    wares.get().then(res => {
      this.setData({
        kinds: res.data
      })
    })
  },
  compare: function (property) {
    return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    if(value1 < value2) return -1;
    else return 1;
  }
},
// 添加到购物车
onAddCart(e){
  const that = this;
  let p = e.currentTarget.dataset.carts;
  var dic = wx.getStorageSync('cart') || {};
  if (p._id in dic) {
    dic[p._id].num += 1;
  } else {
    dic[p._id] = { name: p.name, price: p.buy, url: p.url, num: 1, selected: true}
  }
  wx.setStorageSync('cart', dic);
  wx.showToast({
    title: '添加成功',
    icon: 'success',
    duration: 500
  })
},
click: function(e) {
  var kind = e.currentTarget.dataset.kinds;
  let goodsS = [];
  for(var i=0;i<this.data.goods.length;i++)
  {
      if(this.data.goods[i].category==kind)
          goodsS.push(this.data.goods[i]);
  }
  var id = e.currentTarget.dataset.id;   
  this.setData({
    goodsSelected: goodsS,
    curId: id
  })
},
})