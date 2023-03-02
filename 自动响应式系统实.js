class Dep {
    constructor() {
        this.subscribers = new Set()
    }

    notify() {
        this.subscribers.forEach(effect => effect())
    }
    depend() {
        this.subscribers.add(activeEffect)
    }
}
let dep = new Dep()

let info = { count: 100 }
let activeEffect = null
function watchEffect(effect) {
    activeEffect = effect
    dep.depend()
    activeEffect = null
}
watchEffect(function doubleCounter() {
    console.log(info.count * 2);
})
watchEffect(function powerCounter() {
    console.log(info.count * info.count)
})



// dep.addEffect(doubleCounter)
// dep.addEffect(powerCounter)

info.count++
dep.notify()