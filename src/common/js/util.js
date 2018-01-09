// 获取min~max之间的数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// 把数组打散
export function shuffle(arr) {
    let _arr = arr.slice()
    for (let i = 0; i < _arr.length; i++) {
        let num = getRandomInt(0, i)
        let temp = _arr[i]
        _arr[i] = _arr[num]
        _arr[num] = temp
    }
    return _arr
}

// 节流
export function deBounce(fun, delay) {
    let time
    return function(...args) {
        if (time) {
            clearTimeout(time)
        }
        time = setTimeout(() => {
            fun.apply(this, args)
        }, delay)
    }
}