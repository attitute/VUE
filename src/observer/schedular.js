import { nextTick } from "../util"

let has = {}
let queue = []
let pending = false

function flushSchedularQueue() {
  for (let i = 0; i < queue.length; i++) {
      let watcher = queue[i]
      watcher.run()    
  }
  queue = []
  has = {}
  pending = false
}

export function queueWatcher(watcher){
  let id = watcher.id
  if(has[id] == null){ // 更新对watcher进行去重操作
    queue.push(watcher)
    has[id] = true
    // 让queue清空
    if (!pending) {
      pending = true
      nextTick(flushSchedularQueue);
    }
  }
}