module.exports = {
  root: true,
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'dev' ? 2 : 0,
    'spaced-comment': 0,
    'eqeqeq': 0,
    'one-var': 0,
    'camelcase': 0,
    // 变量未使用
    'no-unused-vars': 0,
    "comma-dangle": ["error", "never"], // 要求或禁止末尾逗号：不允许逗号
    "indent": ["error", 2], // JavaScript代码强制使用一致的缩进：2格缩进
    "semi": ["error", "never"] // 不使用分号
  }
}
