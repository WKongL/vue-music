import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

/*
insertArra是往本地存储的数组插入数据
arr: 要插入的数组
val: 要插入的值
compare: findIndex需要的比较的函数
maxLen: 数组的最大长度
 */
function insertArray(arr, val, compare, maxLen) {
    let findex = arr.findIndex(compare)
    // 需要插入的数据在第一位则不处理
    if (findex === 0) {
        return
    }
    if (findex > 0) {
        arr.splice(findex, 1)
    }
    arr.unshift(val)
    if (maxLen && maxLen > SEARCH_MAX_LENGTH) {
        arr.pop()
    }
}

// arr根据compare的规则删除对应的数据
function deleteArray(arr, compare) {
    let index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}
// 在本地存储搜索历史记录
export function saveSearchHistory(query) {
    let search = storage.get(SEARCH_KEY, [])
    insertArray(search, query, (item) => {
        return item === query
    }, SEARCH_MAX_LENGTH)
    storage.set(SEARCH_KEY, search)
    return search
}

// 在本地存储读取历史记录
export function loadSearchHistory() {
    return storage.get(SEARCH_KEY, [])
}

// 在本地存储删除历史记录
export function deleteSearchHistory(query) {
    let search = storage.get(SEARCH_KEY, [])
    deleteArray(search, (item) => {
        return item === query
    })
    storage.set(SEARCH_KEY, search)
    return search
}

// 清空本地存储历史记录
export function clearSearchHistory() {
    storage.remove(SEARCH_KEY)
    return []
}