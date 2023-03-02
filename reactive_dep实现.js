class Dep {
    constructor() {
        this.subscribers = new Set()
    }
    addEffect(effect) {
        this.subscribers.add(effect)
    }
    notify() {
        this.subscribers.forEach(effect => effect())
    }
}
let dep = new Dep()

let info = { count: 100 }

function doubleCounter() {
    console.log(info.count * 2);
}
function powerCounter() {
    console.log(info.count * info.count)
}


dep.addEffect(doubleCounter)
dep.addEffect(powerCounter)

info.count++
dep.notify()