import '../assets/css/_base.scss'
import '../assets/css/index.scss'
import headScroll from '../common/headScroll'
import swipeSlider from '../common/swipeSlider'
import Api from 'Api'

const $ = window.jQuery
// console.log($headerSearch)

// 轮播
swipeSlider()

// header
headScroll()

//点击事件
$('.mb-title-more').on('click', function () {
  console.log('mb-title-more')
  Api.sendReward()
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
