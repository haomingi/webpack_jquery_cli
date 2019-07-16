// import $ from 'jquery'
import Swiper from '../lib/swiper'
const $ = window.jQuery

function swipeSliders () {
  let current = null
  new Swiper({
    container: $('.swiper-container')[0],
    direction: 'horizontal',
    auto: false,
    interval: 3000,
    threshold: 50,
    duration: 300,
    height: $('.mb-main-swiper').height(),
    item: '.swiper-item'
  }).on('swiped', function (prev, currents) {
    // console.log(currents)
    current = currents
    $('.swiper-indicator>i').removeClass('active')
    $('.swiper-indicator>i').addClass(function (index, oldclass) {
      if (currents === index) return 'active'
    })
  })
  // $('#full_feature').swipeslider()
  // $('#content_slider').swipeslider({
  //   transitionDuration: 600,
  //   autoPlayTimeout: 10000,
  //   sliderHeight: '300px'
  // })
  // $('#responsiveness').swipeslider()
  // $('#customizability').swipeslider({
  //   transitionDuration: 1500,
  //   autoPlayTimeout: 4000,
  //   timingFunction: 'cubic-bezier(0.38, 0.96, 0.7, 0.07)',
  //   sliderHeight: '30%'
  // })
  // $('.sw-next-prev').addClass('dn')
}

export default swipeSliders
