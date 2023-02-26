/**
 *      const vnode = h('div', { class: 'why', id: "box1" }, [
            h("h2", null, "哈哈哈"),
            h("button", null, '+1')
        ])
        mount(vnode, document.querySelector("#app"))
 * 
 * 
 */


const h = (tag, props, children) => {
    // 拿到元素名称 、属性（空为null）、 及子元素

    return {
        tag, props, children
    }
}
const mount = (vnode, container) => {
    // 拿到元素名称生成对应元素
    const el = vnode.el = document.createElement(vnode.tag)
    // 判断是否传入第二个参数props
    if (vnode.props) {
        // for in遍历拿到的对象
        for (const key in vnode.props) {
            // 拿到每一个对象value值
            const value = vnode.props[key]
            // 判断如果key是以on开头
            if (key.startsWith('on')) {
                // 就创建事件监听（事件名：因为都是以on开头，裁掉前两位之后在转换为小写、、事件处理函数）
                el.addEventListener(key.slice(2).toLowerCase(), value)
            } else {
                // 否则就是穿的属性 就设置属性
                el.setAttribute(key, value)
            }
        }
    }

    // 判断第三个参数children 是否为字符串类型
    if (typeof vnode.children === 'string') {
        // 是的话就直接添加到元素内部文字
        el.textContent = vnode.children
    } else {
        // 否则遍历递归 每一次在调用mount函数
        vnode.children.forEach(item => {
            mount(item, el)
        })
    }

    container.appendChild(el)
}