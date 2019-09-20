/*
 * @Description: 顶部的click事件
 * @Author: haoming
 * @Date: 2019-07-18 09:16:38
 * @LastEditors: haoming
 * @LastEditTime: 2019-08-08 17:57:15
 */
const $ = window.jQuery
const $mbNavigate = $('.mb-navigate')
let $userArrow = null
let $menuBody = null

function headClick () {
  // 目录出现
  // const bodymovin = window.bodymovin
  // let iconMenu = document.querySelector('.bodymovinanim')
  // let animationMenu = bodymovin.loadAnimation({
  //   container: iconMenu,
  //   renderer: 'svg',
  //   loop: false,
  //   autoplay: false,
  //   path: '../static/menu-V2.json'
  // })
  // var directionMenu = 1
  // iconMenu.addEventListener('click', (e) => {
  //   console.log('1')
  //   animationMenu.setDirection(directionMenu)
  //   animationMenu.play()
  //   directionMenu = -directionMenu
  //   // animationMenu.playSegments([0, 60], true)
  // })
  // 目录点击
  var Top = null
  var mbNavigateBool = null
  $('.index-contents').on('click', function () {
    // 出现
    if ($mbNavigate.hasClass('view')) {
      // 传递给headScroll.js 当前目录是否出现
      window.moveBy.scroBol = true
      $mbNavigate.removeClass('view').addClass('view-leave')
      $('body').removeClass('fixed')
      $(window).scrollTop(Top)
      $('svg:first-child', $(this)).show()
      $('svg:last-child', $(this)).hide()
      // window.moveBy.headScroll 引入headScroll.js的才会触发这个
      if (Top > 20 && window.moveBy.headScroll) {
        $('.mb-header .search').parent().show()
        $('.mb-header .search').parent().removeClass('dn')
        $('.mb-header .search').css('opacity', 1)
      }
    } else {
      // 隐藏
      window.moveBy.scroBol = false
      $mbNavigate.removeClass('view-leave').addClass('view')
      $('svg:first-child', $(this)).hide()
      $('svg:last-child', $(this)).show()
      setTimeout(() => {
        Top = $(window).scrollTop()
        $('body').addClass('fixed')
        // window.moveBy.headScroll 引入headScroll.js的才会触发这个
        if (Top > 20 && window.moveBy.headScroll) {
          $('.mb-header .search').parent().hide()
          $('.mb-header .search').css('opacity', 0)
          $('.mb-header .search').parent().addClass('dn')
        }
      }, 250)
    }
    // 处理快速点击时候的问题
    clearTimeout(mbNavigateBool)
    mbNavigateBool = setTimeout(() => {
      // 此时目录隐藏了
      if ($mbNavigate.hasClass('view-leave') && $('body').hasClass('fixed')) {
        $('body').removeClass('fixed')
      }
    }, 300)
  })
  // 顶部svg click
  $('.mb-navigate-icon').on('click', function () {
    $menuBody = $(this).parent().parent().next()
    $userArrow = $(this)
    if ($userArrow.hasClass('rotate')) { //再次点击箭头回来
      $userArrow.removeClass('rotate')
      $userArrow.addClass('rotate1')
      $menuBody.hide()
    } else {
      $userArrow.removeClass('rotate1') //点击箭头旋转180度
      $userArrow.addClass('rotate')
      $menuBody.show()
    }
  })
}

export default headClick
