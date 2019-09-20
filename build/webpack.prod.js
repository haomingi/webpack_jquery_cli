const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.config.js')
// js压缩
const TerserJSPlugin = require('terser-webpack-plugin')
// css压缩
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'cheap-module-source-map', // source-map
  module: {
    rules: [{
      test: /\.(sa|sc|c)ss$/,
      use: [{
        loader: MiniCssExtractPlugin.loader
      },
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: (loader) => [
            require('postcss-import')({
              root: loader.resourcePath
            }),
            require('postcss-cssnext')(),
            require('cssnano')()
          ]
        }
      },
      'sass-loader'
      ]
    }]
  },
  plugins: [
    // 清除
    new CleanWebpackPlugin()
  ],
  // optimization.splitChunks代码引用去重分离，把公共引用代码抽离到再另一个output.js中
  // 感觉optimization.splitChunks是用在多页面代码去重分离的
  // 单页面所有第三方库已经用了dll配合manifest保证只引入一次了，不用optimization.splitChunks了
  // 如果多页面用了dll还需要用optimization.splitChunks的，如果生成的commonSplit.js文件过大，可以试试import(/* webpackChunkName:"xxx"*/ 'xxx')动态引入xxx库，打包时output会通过chunkFilename动态拆分细化commonSplit.js，减小不必要的加载
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        // 开启缓存
        cache: true,
        // 压缩需要
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      cacheGroups: {
        vendor: { //node_modules内的依赖库
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          minChunks: 2, //被不同entry引用次数(import),1次的话没必要提取
          maxInitialRequests: 5,
          minSize: 0,
          priority: 100
          // enforce: true?
        },
        commons: { // ‘src/js’ 下的js文件
          chunks: 'all',
          test: /[\\/]src[\\/]js[\\/]/, //也可以值文件/[\\/]src[\\/]js[\\/].*\.js/,
          name: 'commons', //生成文件名，依据output规则
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 1
        }
      }
    },
    // 多页面开启single避免每个chunk都写入了webpack初始化，设置single多页面将只写入一个webpack初始化
    runtimeChunk: 'single'
  }
})
