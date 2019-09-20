const $ = window.jQuery

$('img').one('error', function (e) {
  $(this).attr('src', '../static/img-error.png')
})
