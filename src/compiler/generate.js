
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配带有{{}}

// 整理ast语法树中元素属性
function genProps(attrs){
  let str = ''
  for(let i = 0; i < attrs.length; i++){
    let attr = attrs[i]
    if (name === 'style'){
      let obj = {};
      // value =  color: 'red';fontSize: '18px'
      attr.value.split(';').forEach(item=>{
        let [key,value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj // {color:'red';fontSize:'18px'}
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

// 处理ast语法树中的子元素
function genChildren(el){
  const children = el.children;
  if (children) {
    return children.map(child=>gen(child)).join(',')
  }
}
// 分别处理不同子元素（text，dom）
function gen(node) {
  if(node.type == 1){
    return generate(node)
  } else {
    // 文本 逻辑不能用_c处理
    // 有{{}}普通文本 混合文本 {{a}}b{{c}}
    let text = node.text
    if(defaultTagRE.test(text)){
      let tokens = []
      let match; // 当前匹配项
      let index = 0 // 当前匹配索引
      let lastIndex = defaultTagRE.lastIndex = 0// 当前匹配项最后一项索引 （当前索引+匹配内容得长度）
      // 直到找不到{{}} 
      while(match = defaultTagRE.exec(text)) {
        index = match.index
        if(index > lastIndex){ // 当前索引大于匹配项最后一项索引 （那么说明中间就是没匹配内容就是普通文本）
          tokens.push(JSON.stringify(text.slice(lastIndex, index))) // 将普通文本存储起来
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length 
      }
      if (lastIndex < text.length) tokens.push(JSON.stringify(text.slice(lastIndex)))
      return `_v(${tokens.join('+')})`
    }else{
      return `_v(${JSON.stringify(text)})`
    }
  }
}


// 整理ast语法树 生成虚拟DOM
export function generate (el) {
  let children = genChildren(el)
  let code = `_c('${el.tag}',${
    el.attrs.length ? genProps(el.attrs) : 'undefined'
  }${
    children? (',' + children) : ''
  })`
  return code
}

/*
  <div id="app" a=1>
    <div style="color: red;">
      <span>{{name}} <a>hello</a> </span>
    </div>
  </div>

  _c(
    'div',{id:'app', a: 1,b: 2},
    _c(
      'span',
      {style:{color:'red'}}
      ,_s(_v(name)),
      _c(
        a,{},_v('hello')
      )
    )
  )
*/