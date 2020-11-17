// 我们可以吧当前的watcher 放到一个全局变量上
let id = 0
export class Dep {
    constructor (){
        this.id = id++
        this.subs = [] // 属性要记住watcher
    }
    depend(){
        // 让watcher 记住dep
        Dep.target.addDep(this)
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
}
Dep.target = null


export function pushTarget(watcher){
    Dep.target = watcher
}

export function popTarget(){
    Dep.target = null
}
