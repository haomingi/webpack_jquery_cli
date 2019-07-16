import '../assets/css/_base.scss'
import '../assets/css/encyclopedia.scss'
import headScroll from '../common/headScroll'
import swipeSlider from '../common/swipeSlider'

const $ = window.jQuery

// 轮播
swipeSlider()

// header
headScroll()

//点击事件
$('.mb-title-more').on('click', function () {
  console.log('mb-title-more')
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
