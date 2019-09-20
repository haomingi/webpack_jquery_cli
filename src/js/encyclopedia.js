import '../assets/css/_base.scss'
import '../assets/css/encyclopedia.scss'
import headScroll from '../common/headScroll'
import swipeSlider from '../common/swipeSlider'
import headClick from '../common/headClick'
import { getLiHtml } from '../common/getHtml'
import '../common/imgError'
import Api from 'Api'

const $ = window.jQuery
let key = 1
let latest = 1

$(window).on('load', function () {
  // 轮播
  swipeSlider()

  // header
  headScroll()
  headClick()

  //点击事件 最热
  $('.mb-title-hot').on('click', function () {
    // console.log('mb-title-hot')
    key += 1
    Api.getHot.call(this, { data: { 'page': key + '', 'size': 20 } }).then((data) => {
      // console.log(data)
      if (!data.code) {
        let html = getLiHtml(data.compounds)
        $('.hot-html').html(html)
      }
    })
  })
  // 最新
  $('.mb-title-latest').on('click', function () {
    // console.log('mb-title-latest')
    latest += 1
    Api.getLatest.call(this, { data: { 'page': latest + '' } }).then((data) => {
      // console.log(data)
      if (!data.code) {
        let html = getLiHtml(data.compounds)
        $('.latest-html').html(html)
      }
    })
  })

  let indexInput = $('.index-main-search-input')
  $('.index-main-search-button').on('click', function () {
  // index-main-search-input
    let inputVal = indexInput.val()
    console.log('index-main-search-button:' + inputVal)
  })

  $('.index-contents').on('click', function () {
    console.log('index-contents')
  })

  // 字母分类点击
  $('.mb-list-key').on('click', function (e) {
    console.log(e.target.innerHTML)
  // index-main-search-input
  // let inputVal = indexInput.val()
  // console.log('index-main-search-button:' + inputVal)
  })
  // 搜索
  $('.mb-main-search').on('click', function () {
    let url = $(this).attr('data-url')
    if (url !== '') {
      window.location.href = url
    }
  })
})
