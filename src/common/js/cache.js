import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 100

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200
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
    if (maxLen && arr.length > maxLen) {
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

// 在本地存储播放记录
export function savePlayRecord(song) {
    let songs = storage.get(PLAY_KEY, [])
    insertArray(songs, song, (item) => {
        return item.id === song.id
    }, PLAY_MAX_LENGTH)
    storage.set(PLAY_KEY, songs)
    return songs
}

// 读取本地播放记录
export function loadPlayRecord() {
    return storage.get(PLAY_KEY, [])
}

// 在本地存储喜欢歌曲
export function saveFavorite(song) {
    let favorite = storage.get(FAVORITE_KEY, [])
    insertArray(favorite, song, (item) => {
        return item.id === song.id
    }, FAVORITE_MAX_LENGTH)
    storage.set(FAVORITE_KEY, favorite)
    return favorite
}

// 在本地删除喜欢歌曲
export function deleteFavorite(song) {
    let favorite = storage.get(FAVORITE_KEY, [])
    deleteArray(favorite, (item) => {
        return item.id === song.id
    })
    storage.set(FAVORITE_KEY, favorite)
    return favorite
}

// 读取本地存储喜欢歌曲
export function loadFavorite() {
    return storage.get(FAVORITE_KEY, [])
}