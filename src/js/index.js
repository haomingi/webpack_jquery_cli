/*
 * @Description:
 * @Author: haoming
 * @Date: 2019-08-08 11:23:08
 * @LastEditors: haoming
 * @LastEditTime: 2019-09-20 09:59:59
 */
import '../assets/css/_base.scss'
import '../assets/css/index.scss'
// import './commons'
import headScroll from '../common/headScroll'
import swipeSlider from '../common/swipeSlider'
import headClick from '../common/headClick'
import localStorage from 'localStorage'
import { getMoreHtml, getLiHtml } from '../common/getHtml'
import Api from 'Api'
import '../common/imgError'

const $ = window.jQuery
let key = 1

// console.log($headerSearch)

$(window).on('load', function () {
  // 轮播
  swipeSlider()
  // header
  headScroll()
  headClick()
  // 展示弹框
  // let searchData = localStorage.get('mb-first') || false
  // if (!searchData) {
  //   $('body').addClass('fixed')
  //   $('.index-pop').show()
  // }

  $('.popbox-foot').on('click', function () {
    // console.log('pop')
    localStorage.set('mb-first', true)
    $('.index-pop').hide()
    $('body').removeClass('fixed')
  })

  //点击事件 最热
  $('.mb-title-more').on('click', function () {
    // console.log('mb-title-more')
    // .call(this, {method: 'post', data: {}})
    key += 1
    Api.getHot.call(this, { data: { 'page': key + '', 'size': 23 } }).then((data) => {
      console.log(data)
      if (!data.code) {
        let html = getMoreHtml(data.compounds.slice(0, 3))
        let $liHtml = getLiHtml(data.compounds.slice(3))
        let $ul = '<ul class="mb-list-item mb-class">' + $liHtml + '</ul>'
        $('.info-lead').html(html + $ul)
      }
    })
  })

  let indexInput = $('.index-main-search-input')
  $('.index-main-search-button').on('click', function () {
    // index-main-search-input
    let inputVal = indexInput.val()
    console.log('index-main-search-button:' + inputVal)
  })

  // 搜索
  $('.mb-main-search').on('click', function () {
    let url = $(this).attr('data-url')
    if (url !== '') {
      window.location.href = url
    }
  })
})
