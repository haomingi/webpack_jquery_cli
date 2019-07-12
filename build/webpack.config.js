const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const CssUrlRelativePlugin = require('css-url-relative-plugin')

var postcss = require('postcss')

const config = require('./config')
let Entries = {}
// 通过 html-webpack-plugin 生成的 HTML 集合
let HTMLPlugins = []
// 获取cmd命令
const IS_DEV = process.env.NODE_ENV === 'dev'

// 生成多页面的集合
config.HTMLDirs.forEach(page => {
  const htmlPlugin = new HtmlWebPackPlugin({
    filename: `${page}.html`,
    template: path.resolve(__dirname, `../src/pages/${page}.html`),
    chunks: [page], //引入的模块，entry中设置多个js时，在这里引入指定的js，如果不设置则全部引入
    // favicon: path.resolve(__dirname, "./src/public/icon.ico"), //在网页窗口栏上加上图标
    minify: !IS_DEV && {
      collapseWhitespace: true, //清楚空格、换行符
      preserveLineBreaks: true, //保留换行符
      removeComments: false //清理html中的注释 true清除
    }
  })
  HTMLPlugins.push(htmlPlugin)
  Entries[page] = path.resolve(__dirname, `../src/js/${page}.js`)
})

console.log(Entries)
module.exports = {
  entry: Entries,
  output: {
    filename: IS_DEV ? 'js/[name].[hash:8].js' : 'js/[name].[chunkhash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },
  plugins: [
    // 清除
    new CleanWebpackPlugin(),
    ...HTMLPlugins,
    new MiniCssExtractPlugin({
      filename: !IS_DEV ? 'css/[name].[contenthash:8].css' : '[name].css',
      chunkFilename: !IS_DEV ? 'css/[name].[contenthash:8].css' : '[name].css',
      allChunks: true
    }),
    // 自动加载模块，当在项目中遇见$、jQuery、会自动加载JQUERY模块
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    // 将单个文件或整个目录复制到构建目录
    new CopyWebpackPlugin([{
      from: './src/public',
      to: 'public'
    }]),
    // 预加载
    // new PreloadWebpackPlugin({
    //   rel: 'prefetch',
    //   as: 'script',
    //   include: 'asyncChunks',
    //   fileBlacklist: [/\.(css|map)$/, /base?.+/]
    // }),
    new CssUrlRelativePlugin()
  ],
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: [path.resolve(__dirname, '../src')],
      options: {
        formatter: require('eslint-friendly-formatter')
      },
      exclude: [/node_modules/, path.resolve(path.resolve(__dirname, '../src/lib'))]
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true
      },
      include: [path.resolve(__dirname, '../src')],
      exclude: /node_modules/
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        'style-loader',
        'css-loader',
        // {
        //   loader: 'postcss-loader',
        //   options: {
        //     ident: 'postcss',
        //     plugins: (loader) => [
        //       require('postcss-import')({ root: loader.resourcePath }),
        //       require('postcss-cssnext')(),
        //       require('autoprefixer')(),
        //       require('cssnano')()
        //     ]
        //   }
        // },
        'sass-loader'
      ]
    },
    {
      test: /\.(gif|png|jpe?g|svg)$/i,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[name].[ext]',
          fallback: 'file-loader', //超过了限制大小调用回调函数
          outputPath: 'images' //图片存储的地址
        }
      }]
    }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, '../src')
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      //其他入口chunk引用的次数
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true, //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔开，如vendor~
      //使用自定义缓存组
      cacheGroups: {
        //提取第三方库
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          //缓存优先级设置
          priority: -10 // async
        },
        //公共模块
        commons: {
          name: 'common',
          //缓存优先级设置
          priority: -20,
          minChunks: 2,
          reuseExistingChunk: true
        }
      }
    }
  }
}
