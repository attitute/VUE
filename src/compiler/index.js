
import {parseHtml} from './parse'
import { generate } from './generate'

export function compileToFunctions (template) {
  let ast = parseHtml(template) // 生成ast语法树
  let code = generate(ast) // 生成代码

  let render = `with(this){return ${code}}` // width函数 
  let fn = new Function(render) // 把render变成一个匿名函数

  return fn
}