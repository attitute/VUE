import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'


export default {
  input: './src/index.js', // 以哪个文件座位打包的入口
  output: {
    file: 'dist/umd/vue.js', // 出口路径
    name: 'Vue', // 指定打包后全局变量的名字
    format: 'umd', // 统一模块规范
    sourcemap: true, // es6->es5 开启源码调试 可以找到源码报错位置
  },
  plugins: [
    babel({
      exclude: "node_modules/**" // 排除node_modules下面所有的文件
    }),
    process.env.env === 'development' ? serve({
      open: true,
      openPage: '/public/index.html', // 默认打开html路径
      port: 1000,
      contentBase: '', // 以当前文件夹路径
    }) : null
  ]
}