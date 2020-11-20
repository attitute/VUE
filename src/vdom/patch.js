
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
        // diff算法

    }

}

function createComponent(vnode){
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

function updateProperties(vnode) {
    let newProps = vnode.data || {} // 属性
    let el = vnode.el // dom 元素

    for(let key in newProps) {
        if (key == 'style') { // key是不是style
            el.style = newProps.style
        } else if (key == 'class'){
            el.className = newProps.class
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}