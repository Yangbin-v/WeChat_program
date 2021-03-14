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
/*获取当前页带参数的url*/
function getUrl() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  wx.setStorageSync('Router', `/${url}`)
  var options = currentPage.options //如果要获取url中所带的参数可以查看options

  console.log("页面数据:",currentPage);
  //参数多时通过&拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  wx.setStorageSync('Url', `/${urlWithArgs}`)
}

// 获取当前页面路由
function getRouter() { //此方法跟上面一个方法前四行一致，只是这里是获取路由不是拼接参数的
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var router = currentPage.route //当前页面url
  wx.setStorageSync('Router', `/${router}`)
}

module.exports = {
  formatTime: formatTime,
  getUrl,
  getRouter,
}
