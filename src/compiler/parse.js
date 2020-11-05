const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // aa-aa 
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //aa:aa
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 可以匹配到标签名  [1]
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); //[0] 标签的结束名字
//    style="xxx"   style='xxx'  style=xxx
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ //匹配所有的属性
const startTagClose = /^\s*(\/?)>/


export function parseHtml(html) {
  // ast语法树的结构
  function createASTElement (tag, attrs) { // vue3多个根节点（最外层套了一个根元素） vue2只有一个
    return {
      tag,
      type:1,
      children:[],
      attrs,
      parent: null
    }
  }
  let root; // 根元素
  let currenParent; // 当前的父节点
  let stack = [] // dom元素组成的栈
  // 通过开始标签 结束标签 文本内容 生成一个ast语法树
  function start(tagName, attrs) {
    let element = createASTElement(tagName,attrs)
    if (!root) {
      root = element
    }
    currenParent = element
    stack.push(element) // 将开始标签存入栈中
  }
  // 结束标签说明 栈中前一个就是他的父级
  function end(tagName) {
    let element = stack.pop(); // 将结束标签取出
    currenParent = stack[stack.length - 1]
    if (currenParent) {
      element.parent = currenParent
      currenParent.children.push(element)
    }
  }
  // 文本内容直接储存在当前元素children中
  function chars(text) { 
    text = text.replace(/\s/g, '')
    if (text) {
      currenParent.children.push({
        type: 3,
        text
      })
    }
   }
   // 删除字符串
  function advance(n) {
    html = html.substring(n)
  }
  // 截取开头标签
  function parseStartTag() {
    const start = html.match(startTagOpen) // 找到标签名
    if(start){
      let match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length) // 获取元素
      // 查找属性
      let end, attr;
      // 1.不是开头的标签那就一直解析
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push({name: attr[1], value: attr[3] || attr[4] || attr[5] || true})
      }
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }
  // 将html转换成ast语法树
  while(html){
    let textEnd = html.indexOf('<') // 找到第一个标签位置
    if(textEnd == 0) {
      let startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      let endTagMatch = html.match(endTag) // 匹配结束标签
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch.tagName)
        continue
      }

    }
    if (textEnd > 0) {
      let text;
      text = html.substring(0, textEnd)
      if (text) {
        advance(text.length)
        chars(text)
      }
    }
  }
  return root
}

