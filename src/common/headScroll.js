/*
 * @Description: 头部header的效果处理
 * @Author: haoming
 * @Date: 2019-07-15 17:13:56
 * @LastEditors: haoming
 * @LastEditTime: 2019-09-20 09:49:21
 */

const $ = window.jQuery

function headScroll () {
  let $search = $('.mb-main-search')
  let $headerSearch = $('.mb-header .search')
  let $mainSearch = $('.mb-main-search')
  window.moveBy.scroBol = true
  window.moveBy.headScroll = true
  // 默认隐藏
  $('.mb-header .search').parent().addClass('dn')

  // 页面滚动。三种情况：慢慢滑动、快速滑动、惯性滑动
  // 离上方header距离。自身高度+margin-top
  let $searchTop = $search.height()
  $searchTop = Math.round($searchTop * 100) / 100
  let scrollTop = 0
  // 惯性滑动时候，设置更改scrolltop时候会触发下面的$(window).on('touchmove', function (e) {函数，添加字段处理
  let scrollBol = false

  function hasSearch () {
    // console.log(!!(($search.height() / 2) < $(document).scrollTop() && $(document).scrollTop() < ($searchTop + $search.height() / 2)))
    return !!(($search.height() / 2) <= $(document).scrollTop() && $(document).scrollTop() <= ($searchTop + $search.height() / 2))
  }
  $(window).on('touchmove', function (e) {
    if (!window.moveBy.scroBol) return
    // 离顶部距离
    scrollTop = $(document).scrollTop()
    // 当前滑动的距离，小于$searchTop，这个时候搜索框还是可见的
    // console.log($search.height() / 2)
    // console.log(scrollTop)
    // console.log($searchTop)
    // console.log('1')
    // 搜索按钮
    if (scrollBol) return
    let opacity = Math.round((scrollTop - $search.height() / 2) / $searchTop * 100) / 100
    if (($search.height() / 2) < $(document).scrollTop() && $headerSearch.css('opacity') !== 1) {
      // console.log((scrollTop - $search.height() / 2) / $searchTop)
      // $search.height() / 2-->指的是搜索的上边距，这个距离滑动过去之后，在搜索框被遮挡的时候，才开始出现此效果
      // console.log('111111111111')
      // 默认隐藏
      $('.mb-header .search').parent().removeClass('dn')
      if (opacity > 0.9) {
        $headerSearch.css('opacity', 1)
        $mainSearch.css('opacity', 0)
      } else {
        $headerSearch.css('opacity', opacity)
        $mainSearch.css('opacity', 1 - opacity)
      }
    } else if ($(document).scrollTop() < ($searchTop + $search.height() / 2) && $headerSearch.css('opacity') !== 0) {
      // 搜索框
      if (opacity < 0.1) {
        // 此时直接去除这个控制
        $headerSearch.removeAttr('style')
        $mainSearch.removeAttr('style')
        // 默认隐藏
        $('.mb-header .search').parent().addClass('dn')
      } else {
        $headerSearch.css('opacity', opacity)
        $mainSearch.css('opacity', 1 - opacity)
      }
    }
  })

  $(window).on('touchstart', function (e) {
    var _touch = e.originalEvent.changedTouches[0]
    _s = _touch.screenY
    // console.log(_s)
    // 滑动过程中 结束惯性
    clearInterval(int)
    clearInterval(tt)
    clearInterval(cc)
  })

  $(window).on('touchend', function (e) {
    var _touch = e.originalEvent.changedTouches[0]
    _e = _touch.screenY
    scrollBol = true
    // 存储离开时候的上距离
    scrollTop = $(document).scrollTop()
    lastScreenY = scrollTop
    // if (hasSearch()) {
    // console.log('33')
    // if (Number($headerSearch.css('opacity')) === 0 || Number($headerSearch.css('opacity')) === 1) {
    //   console.log('不用了')
    //   scrollBol = false
    //   return
    // }
    int = setInterval(clock, 80)
    // }
    // }
  })

  //touchend
  var int = null
  var tt = null
  var cc = null
  let turn = ''
  var _s = 0
  var _e = 0
  let lastScreenY = null

  function clock () {
    var t = Number($headerSearch.css('opacity'))
    let num = 0
    // 确定方向
    if (_s < _e) {
      // 屏幕向上
      num = t - 0.15
    } else {
      // 屏幕向下
      num = t + 0.15
    }
    // 证明惯性没处发或者惯性停止
    if (lastScreenY === $(document).scrollTop()) {
      // 停止clock定时
      clearInterval(int)
      // console.log('end')
      // 此处判断停下的位置 是不是正好遮挡search
      if (hasSearch()) {
        // 展示搜索框
        // console.log('正好遮挡')
        if (_s < _e) {
          // 屏幕向上
          // console.log('屏幕向上')
          let h = 0
          tt = setInterval(function () {
            h = $(document).scrollTop()
            // 次数
            var nh = h / 5
            var heaOpa = Number($headerSearch.css('opacity'))
            var bf = heaOpa / nh
            var Nbf = heaOpa - bf
            h -= 5
            if (h > 0) {
              $(document).scrollTop(h)
              $headerSearch.css('opacity', Nbf)
              $mainSearch.css('opacity', 1 - Nbf)
            } else {
              clearInterval(tt)
              $(document).scrollTop(0)
              scrollBol = false
              $headerSearch.removeAttr('style')
              $mainSearch.removeAttr('style')
              // 默认隐藏
              $('.mb-header .search').parent().addClass('dn')
            }
          }, 30)
        } else {
          // 屏幕向下
          // console.log('屏幕向下')
          let r = 0
          cc = setInterval(function () {
            r = $(document).scrollTop()
            // 次数
            var nh = r / 5
            var heaOpa = Number($headerSearch.css('opacity'))
            var bf = heaOpa / nh
            var Nbf = heaOpa + bf
            r += 5
            if (r < ($searchTop + $search.height() / 2)) {
              $(document).scrollTop(r)
              $headerSearch.css('opacity', Nbf)
              $mainSearch.css('opacity', 1 - Nbf)
            } else {
              clearInterval(cc)
              $(document).scrollTop(($searchTop + $search.height() / 2))
              scrollBol = false
              $headerSearch.css('opacity', 1)
              $mainSearch.css('opacity', 0)
            }
          }, 30)
        }
      } else if ($(document).scrollTop() <= ($search.height() / 2)) {
        // 重置，看到搜索框
        $headerSearch.removeAttr('style')
        $mainSearch.removeAttr('style')
        // 默认隐藏
        $('.mb-header .search').parent().addClass('dn')
      } else if (($searchTop + $search.height() / 2) <= $(document).scrollTop()) {
        // 重置，看不到搜索框
        $headerSearch.css('opacity', 1)
        $mainSearch.css('opacity', 0)
      }
      scrollBol = false
      return
    } else if (hasSearch()) {
      // 惯性滑动到能看到框的时候
      if (num >= 1) {
        $headerSearch.css('opacity', 1)
        $mainSearch.css('opacity', 0)
      } else if (num < 0) {
        $headerSearch.removeAttr('style')
        $mainSearch.removeAttr('style')
        // 默认隐藏
        $('.mb-header .search').parent().addClass('dn')
      } else {
        $headerSearch.css('opacity', num)
        $mainSearch.css('opacity', 1 - num)
      }
    } else if (($(document).scrollTop() > ($searchTop + $search.height() / 2)) && Number($headerSearch.css('opacity')) < 1) {
      //向上惯性滑动，距离短不用处理。此处处理向下惯性滑动，看不到搜索框，并且搜索图片还没全部出现
      $headerSearch.css('opacity', num)
      $mainSearch.css('opacity', 1 - num)
    } else if (($(document).scrollTop() < ($search.height() / 2)) && Number($headerSearch.css('opacity')) > 0) {
      //向上惯性滑动，距离短不用处理。此处处理向下惯性滑动，看不到搜索框，并且搜索图片还没全部出现
      $headerSearch.removeAttr('style')
      $mainSearch.removeAttr('style')
      // 默认隐藏
      $('.mb-header .search').parent().addClass('dn')
    }
    // 每次结束都从新赋值，本次与上次一样，证明惯性没处发或者惯性停止
    lastScreenY = $(document).scrollTop()
  }
}

export default headScroll
