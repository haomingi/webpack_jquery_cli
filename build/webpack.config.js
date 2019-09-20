const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const CopyWebpackPlugin = require('copy-webpack-plugin')
// const PreloadWebpackPlugin = require('preload-webpack-plugin')
const CssUrlRelativePlugin = require('css-url-relative-plugin')

// var postcss = require('postcss')
var aliasConfig = require('./aliasConfig')

const config = require('./config')
let Entries = {}
// 通过 html-webpack-plugin 生成的 HTML 集合
let HTMLPlugins = []
// 获取cmd命令
const IS_DEV = process.env.NODE_ENV === 'dev'
// 代理地址 内容可单独提出去
var target = 'http://dev-m.molbase.com/'

// 生成多页面的集合
config.HTMLDirs.forEach(page => {
  let obj = {
    filename: `${page}.html`,
    template: path.resolve(__dirname, `../src/pages/${page}.html`),
    chunks: [page], //引入的模块，entry中设置多个js时，在这里引入指定的js，如果不设置则全部引入
    // favicon: path.resolve(__dirname, "./src/public/icon.ico"), //在网页窗口栏上加上图标
    minify: !IS_DEV && {
      collapseWhitespace: true, //清楚空格、换行符
      preserveLineBreaks: true, //保留换行符
      removeComments: false //清理html中的注释 true清除
    }
  }
  if (!IS_DEV) {
    // 打包时候，把抽离的公共代码加入页面，不然js不会运行
    obj.chunks = [...obj.chunks, 'runtime', 'vendor']
  }
  const htmlPlugin = new HtmlWebPackPlugin(obj)
  HTMLPlugins.push(htmlPlugin)
  Entries[page] = path.resolve(__dirname, `../src/js/${page}.js`)
})

console.log(Entries)
module.exports = {
  entry: Entries,
  output: {
    filename: IS_DEV ? 'js/[name].[hash:8].js' : 'js/[name].js', // [chunkhash:8].
    path: path.resolve(__dirname, '../dist'),
    publicPath: IS_DEV ? '/' : './'
  },
  resolve: {
    alias: aliasConfig
  },
  plugins: [
    ...HTMLPlugins,
    new MiniCssExtractPlugin({
      filename: !IS_DEV ? 'css/[name].css' : '[name].css', // [contenthash:8]
      chunkFilename: !IS_DEV ? 'css/[name].css' : '[name].css', // [contenthash:8]
      allChunks: true
    }),
    // 自动加载模块，当在项目中遇见$、jQuery、会自动加载JQUERY模块
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery'
    // }),
    // 将单个文件或整个目录复制到构建目录
    new CopyWebpackPlugin([{
      from: './src/static',
      to: 'static'
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
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: '[name].[ext]',
            fallback: 'file-loader', //超过了限制大小调用回调函数
            outputPath: 'images/' //图片存储的地址
          }
        }
      ]
    },
    {
      test: /\.(htm|html)$/i,
      use: [
        'html-withimg-loader'
      ]
    }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, '../src'),
    proxy: {
      '/moldata': {
        target: target,
        changeOrigin: true,
        pathRewrite: {
          '^/moldata': '/moldata'
        }
      }
    }
  },
  devtool: 'cheap-module-eval-source-map', //开发环境js代码不混淆 inline-source-map
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000, // 要生成的块的最小大小（以字节为单位）
      maxSize: 0,
      minChunks: 1, // 分割前必须共享模块的最小块数。
      maxAsyncRequests: 5,
      maxInitialRequests: 3, // 入口点处的最大并行请求数
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      name: true,
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        commons: {
          name: 'common',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
