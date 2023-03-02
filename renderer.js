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

patch = (n1, n2) => {
    // 判断两个虚拟节点是不是同一个元素类型
    if (n1.tag !== n2.tag) {
        // 获取旧节点的父元素
        const n1ElParent = n1.el.parentElement
        // 使用父元素删除旧节点
        n1ElParent.removeChild(n1.el)
        // 使用mount函数 生成dom节点 并挂载到父元素上
        mount(n2, n1ElParent)
    } else {
        // 不是同一类型继续判断
        // 旧节点el在n2中进行保存
        const el = n2.el = n1.el
        // 处理props
        const oldProps = n1.props || {}
        const newProps = n2.props || {}

        for (const key in newProps) {
            /**
             * 遍历新节点 判断新的节点里面是否存在和旧节点一样的属性
             * 旧： classw: 'why',     id: "box1", name: "bbb"
             * 新： classw: 'codewhy', id: "box1"
             * 
             * key [classw,id]
             * why,box1,
             * codewhy,box1
             * 
             *  如果相同key的value不一样 先判断是不是事件 然后设置元素为新的属性
             */

            const oldValue = oldProps[key]
            const newValue = newProps[key]
            if (newValue !== oldValue) {
                if (key.startsWith("on")) {
                    el.addEventListener(key.slice(2).toLowerCase(), newValue)
                } else {
                    el.setAttribute(key, newValue)
                }
            }
        }

        // 删除旧的多余的prop
        for (const key in oldProps) {
            // 遍历旧的props
            // 如果旧的key在新的不存在的话
            if (!(key in newProps)) {
                // 判断是否为事件
                if (key.startsWith("on")) {
                    const value = oldProps[key]
                    el.removeEventListener(key.slice(2).toLowerCase(), value)
                } else {
                    // 删除多余的属性
                    el.removeAttribute(key)
                }
            }
        }

        // 处理children
        const oldChildren = n1.children || []
        const newChildren = n2.children || []
        if (typeof newChildren === 'string') {
            // 边界判断
            el.innerHTML = newChildren
        } else {
            // new是数组，
            if (typeof oldChildren == 'string') {
                el.innerHTML = ''
                newChildren.forEach(item => {
                    mount(item, el)
                })
            } else {
                // 都是数组
                const commonLength = Math.min(oldChildren.length, newChildren.length)
                for (let i = 0; i < commonLength; i++) {
                    patch(oldChildren[i], newChildren[i])
                }

                // [v1, v2, v3, v2, v2]
                // [v1, v5, v9, v7]
                if (newChildren.length > oldChildren.length) {
                    newChildren.slice(oldChildren.length).forEach(item => {
                        mount(item, el)
                    })
                }
                if (newChildren.length < oldChildren.length) {
                    oldChildren(newChildren.length).forEach(item => {
                        el.removeChild(item.el)
                    })
                }
            }
        }
    }
}