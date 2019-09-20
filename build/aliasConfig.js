var path = require('path')

// 获取绝对路径
function getAbsolutePath (addr) {
  if (!/\/src\//.test(addr)) {
    addr = '../src/' + addr
  }
  return path.resolve(__dirname, addr)
}

module.exports = {
  'src': path.resolve(__dirname, '../src'),

  'Api': getAbsolutePath('services/api.js'),
  'localStorage': getAbsolutePath('services/localStorage.js')
}
