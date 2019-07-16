/**
 * Created by xuxin on 16/3/22.
 */
import axios from 'axios'
import qs from 'qs'
import ApiMap from './config.api'
// import localStorageCtrl from 'localStorageCtrl'
// import urlService from 'urlService'

// android 4.1不支持promise
if (!window.Promise) {
  window.Promise = require('es6-promise').Promise
}

const Promise = window.Promise

//axios配置
axios.defaults.timeout = 15000 // 响应时间，fzc:跟app同步。5s测试觉得太短
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded' // 配置post请求头

function noop () {}

// 检查 str 不是 arr里的元素
function isMatch (url, arr) {
  var state = false
  arr.some(function (item) {
    // 匹配目录
    if (url === ApiMap[item]) {
      state = true
    }
  })
  return state
}

// state 是否隐藏
function closeLoadding (state) {
  // if (state) return
  // Loading.hide()
}

function requireLogin (logined) {
  return !(parseInt(logined) !== 0)
}

function redirect () {
  // urlService.setRedirectUrl()
  // urlService.goLogin()
}

function request (options) {
  let resolve = options.resolve || noop
  let reject = options.reject || noop
  let method = options.method || 'get'
  let data = options.data || {}
  let url = options.url || ''
  let isHideTip = options.isHideTip
  let isHideLoadding = isMatch(url, []) // Conf.noLoading
  // 用alert报错
  let alertErrorMsg = options.alertErrorMsg
  data.client = data.client || 'wap'// !!!!
  if (!isHideLoadding) {
    // Loading.show()
  }

  function jsonToQueryString (json) {
    return '?' +
      Object.keys(json).map(function (key) {
        return encodeURIComponent(key) + '=' +
          encodeURIComponent(json[key])
      }).join('&')
  }
  // let http = this && this.$http || Vue.http
  let promise = ''
  if (method === 'get') {
    url += jsonToQueryString(data)
    promise = axios.get(url)
  } else {
    promise = axios.post(url, qs.stringify(data))
  }
  let context = this

  return promise
    .then(function (response) {
      let res = response.data
      if (res && res.boolen) {
        res.boolen = parseInt(res.boolen) //字符串转数字
      }
      if (requireLogin(res.logined)) { //需登录则跳到登陆页面
        if (!options.noDirect) {
          // 跳到app就不运行下面
          redirect.call(context)
        }
      }
      if (res && !res.boolen && !isHideTip) { //没找到则需弹tip
        if (alertErrorMsg) {} else {}
        reject.call(context, res)
      }
      closeLoadding(isHideLoadding)
      resolve.call(context, res)
      return res
    }, function (response) {
      // wap.vm.$Tip(response.statusText || '系统连接超时，请稍后再试')
      reject.call(context, response.statusText)
      closeLoadding(isHideLoadding)
      return response.statusText
    })
}
// let START_WITH_FLASH = /^\//
// let START_WITH_HTTP = /^http/
/*
 在api上默认包装实现Promise.all
 api中接收的arr类型,对象中name对应接口名，其它字段与之前一致
[
  {
    name: 'helpQuestion',
    data: {
      type: 2
    }
  }, {
  name: 'getAccountEntries'
  }
]*/
function api (arr) {
  let promiseArr = []
  if (Array.isArray(arr)) {
    for (let v of arr) {
      promiseArr.push(api[v.name].call(this, v))
    }
    return axios.all(promiseArr)
  } else if (typeof arr === 'string') {
    //防止参数传递是字符串
    return api[arr].call(this)
  } else if (typeof arr === 'object' && arr.name) {
    return api[arr.name].call(this, arr)
  } else {
    window.alert('api函数参数传递错误！！')
    return Promise.reject(new Error('api函数参数传递错误！！'))
  }
}

// options.isHideErrorPop = true // 说明不要弹出错误提示框
var createApi = function (key) {
  api[key] = function (options) {
    options = options || {}
    let reject = options.reject || noop
    // 检测网络状态 安卓以外的 通过这种方式监测网络
    if ((typeof navigator.onLine === 'boolean' && !navigator.onLine)) {
      // wap.vm.$Tip('无法连接到服务器或网络，请检查网络设置')
      reject.call(this)
      return false
    }

    let url = ApiMap[key]
    //if (!START_WITH_HTTP.test(url)) {
    //  url = START_WITH_FLASH.test(url) ? url : '/' + url
    //  url = Config['host'] + url
    //}
    options.url = url
    if (!options.hasOwnProperty('isHideTip')) {
      // options.isHideTip = Conf.noTipAjax.indexOf(key) > -1
      // 用alert报错
      // options.alertErrorMsg = Conf.alertErrorMsg.indexOf(key) > -1
    }
    // if (Conf.apiNoDirect.indexOf(key) > -1) {
    //   options.noDirect = true
    // }
    return request.call(this, options)
  }
}

for (var key in ApiMap) {
  if (ApiMap.hasOwnProperty(key)) {
    createApi(key)
  }
}

export default api
