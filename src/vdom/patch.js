import { isSameVnode } from "./index"

export function patch (oldVnode,vnode) {
    if (!oldVnode) return createElm(vnode)
    // oldVnode 是一个真实的元素
    const isRealElment = oldVnode.nodeType

    if(isRealElment){
        // 初次渲染
        const oldElm = oldVnode // id = "app"
        const parentElm = oldElm.parentNode // body

        let el = createElm(vnode) // 根据虚拟节点创建真实的节点

        parentElm.insertBefore(el, oldElm.nextSibling)
        parentElm.removeChild(oldElm)

        return el // vm.$el

    }else {
        // diff算法 要点：1.双指针 2.对常用操作的几种优化 3.无序排列是怎么做到的
        // 1.如果两个虚拟节点得标签不一致 直接替换即可
        if (oldVnode.tag !== vnode.tag){
            return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
        }
        // 2.标签一样但是是两个文本元素 文本元素tag是undefined
        if (!oldVnode.tag) {
            if (oldVnode.text != vnode.text){
                return oldVnode.el.textContent = vnode.text
            }
        }
        // 3.元素相同,复用老节点,并且更新属性
        let el = vnode.el = oldVnode.el
        // 用老的属性和新的虚拟节点进行比对
        updateProperties(vnode, oldVnode.data)

        // 4.更新儿子
        let oldChildren = oldVnode.children || []
        let newChildren = vnode.children || []
        
        if (oldChildren.length > 0 && newChildren.length > 0){ // 1.老的有儿子 新的也有儿子 diff算法
            updateChildren(el,oldChildren, newChildren)
        
        }else if (oldChildren.length > 0){ // 2. 老的有儿子 新的没 删除老的
            el.innerHTML = ''
        
        }else if (newChildren.length > 0) { // 3. 新的有儿子 老的没 直接增加
            newChildren.forEach(child => el.appendChild(createElm(child)))
        }
    }

}

function updateChildren(parent,oldChildren, newChildren) {
    
    let oldStartIndex = 0; // 老的头索引
    let oldEndIndex = oldChildren.length - 1; // 老的尾索引
    let oldStartVnode = oldChildren[0]; // 老的开始节点
    let oldEndVnode = oldChildren[oldEndIndex]; // 老的结束节点

    let newStartIndex = 0; // 新的头索引
    let newEndIndex = newChildren.length - 1; // 新的尾索引
    let newStartVnode = newChildren[0]; // 新的开始节点
    let newEndVnode = newChildren[newEndIndex]; // 新的结束节点

    function makeIndexByKey(oldChildren) {
        let map = {}
        oldChildren.forEach((item,index)=>{
            map[item.key] = index
        })
        return map
    }

    let map = makeIndexByKey(oldChildren)


    while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex){
        // 1.前端中比较常见的操作有 像尾部插入 头部插入 头移动到尾部 尾部移动头部，正序和反序
        if(!oldStartVnode){ // 可能节点从前往后移动 发现是空的
            oldStartVnode = oldChildren[++oldStartIndex]
        }else if (!oldEndVnode){ // 可能节点从后往前移动 发现是空的
            oldEndVnode = oldChildren[--oldEndIndex]
        // 1.向后插入的操作 
        }else if (isSameVnode(oldStartVnode,newStartVnode)){// 头和头是否相同
            patch(oldStartVnode,newStartVnode)
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
        // 2.向前插入
        }else if(isSameVnode(oldEndVnode,newEndVnode)){// 尾和尾是否相同
            patch(oldEndVnode,newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex]
        // 3.老的头部与新的尾部相同时
        }else if(isSameVnode(oldStartVnode,newEndVnode)){// 老头和新尾是否相同
            patch(oldStartVnode,newEndVnode)
            parent.insertBefore(oldStartVnode.el,oldEndVnode.el.nextSibling) // 插入到老的（oldEndVnode）下一个的前面  // oldEndVnode一直是第一次那个老节点
            oldStartVnode = oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]
        // 4.老尾和新头比
        }else if(isSameVnode(oldEndVnode, newStartVnode)) {
            patch(oldEndVnode,newStartVnode)
            parent.insertBefore(oldEndVnode.el,oldStartVnode.el)
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
        // 5. 无序排列
        }else {
            // 1.需要先查找当前 老节点索引和key的关系
            // 移动的时候通过新的key 去找对应的老节点索引 -> 获取老节点，可以移动老节点
            let moveIndex = map[newStartVnode.key]
            if(moveIndex == undefined) { // 如果老节点里没有新节点的元素
                parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
            } else {
                let moveVnode = oldChildren[moveIndex]
                oldChildren[moveIndex] = undefined // 对移动的元素原先位置补一个值
                patch(moveVnode, newStartVnode) // 进行两个虚拟节点的属性处理
                parent.insertBefore(moveVnode.el, oldStartVnode.el)
            }
            newStartVnode = newChildren[++newStartIndex]
        }
    }
    if (newStartIndex <= newEndIndex){ // 新的比老的多 插入新节点
        for (let i = newStartIndex; i <= newEndIndex; i++){
            // 向前插入 向后插入

            let nextEle = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex+1].el
        
            parent.appendChild(createElm(newChildren[i]), nextEle)

        }
    }
    if(oldStartIndex <= oldEndIndex){ // 老的比新的多 删除多余节点
        for(let i = oldStartIndex; i <= oldEndIndex; i++){
            let child = oldChildren[i]
            if(child){
                parent.removeChild(child.el)
            }
        }
    }
}

function updateProperties(vnode,oldProps = {}) {
    let newProps = vnode.data || {} // 属性
    let el = vnode.el // dom 元素
    // 1.老的属性 新的没有 删除属性
    for (let key in oldProps) {
        if (!newProps[key]) {
            el.removeAttribute(key)
        }
    }
    let newStyle = newProps.style || {}
    let oldStyle = oldProps.style || {}
    for (let key in oldStyle){
        if(!newStyle[key]){
            el.style[key] = ''
        }
    }
    // 2. 新的属性老的没 直接用新的属性覆盖
    for(let key in newProps) {
        if (key == 'style') { // key是不是style
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if (key == 'class'){
            el.className = newProps.class
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}

function createComponent(vnode, oldChildren){
    let i = vnode.data
    // i.hook && i.hook.init
    // i = i.hook.init
    // i = ihook i里面hook里面有init 那就是组件
    if ((i = i.hook) && (i = i.init)){
        i(vnode) // 调用组件得初始化方法 得到vnode.componentInstance.$el
    }
    if (vnode.componentInstance) { // 如果虚拟节点有
        return true
    }
    return false
}
// 生成真实节点
export function createElm(vnode) {
    let {tag, children, key, data, text, vm} = vnode

    if(typeof tag === 'string'){
        // 如果是组件 就根据组件创建出组件里面内容的真实节点
        if (createComponent(vnode)){ // 如果是组件，就将组件渲染后结果返回
            return vnode.componentInstance.$el
        }


        vnode.el = document.createElement(tag) // 生成元素

        updateProperties(vnode) // 生成样式

        children.forEach(child=>{ // 递归 产生元素
            vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }

    return vnode.el

}
