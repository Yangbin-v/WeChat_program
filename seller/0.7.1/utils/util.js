const app = getApp()

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getIconURL = (key, list) => {
  let URLlist;
  return new Promise(function(resolve) {
    wx.getStorage({
      key: key,
      success: res => {
        let nowdate = Date.parse(new Date());
        let tempdate = res.data.date;
        let now_temp = nowdate - tempdate;
        if (now_temp<24*60*60*1000) {
          
          resolve(res.data.list);
        }
        else {
          module.exports.upIconURL(key, list).then(res=>{resolve(res)})
        }
      },
      fail: err => {
        console.log(123);
        module.exports.upIconURL(key, list).then(res=>{resolve(res)})
      }
    })
  })
}

const upIconURL = (key, list) => {
  let db = app.cloud
  let URLlist = []
  return new Promise(function(resolve) {
    db.callFunction({
      name: "geticonurl",
      data: {
        list: list
      }
    }).then(res=>{
      for (var i of res.result) {
        URLlist.push(i.tempFileURL)
      }
      wx.setStorage({
        data: {
          list: URLlist,
          date: Date.parse(new Date())
        },
        key: key,
      })
      resolve(URLlist);
    })
  })
}

module.exports = {
  formatTime: formatTime,
  upIconURL: upIconURL,
  getIconURL: getIconURL,
}
