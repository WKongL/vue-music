import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearchHistory, deleteSearchHistory, clearSearchHistory} from 'common/js/cache'

function findSongIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}
// 顺序播放模式
export const selectPlay = function({commit, state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
        let randomlist = shuffle(list)
        commit(types.SET_PLAYLIST, randomlist)
        index = findSongIndex(randomlist, list[index])
    } else {
        commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}
// 随机播放模式
export const randomPlay = function({commit, state}, {list}) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    const randomlist = shuffle(list)
    commit(types.SET_PLAYLIST, randomlist)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

// 歌曲列表中插入歌曲
export const insertSong = function ({commit, state}, song) {
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let currentSong = playList[currentIndex]

    // 查找playlist中有没有song歌曲
    let fpindex = findSongIndex(playList, song)
    currentIndex++
    // 把song插入到playlist中
    playList.splice(currentIndex, 0, song)
    // playlist存在插入的歌曲
    if (fpindex > -1) {
        // 插入歌曲的序号大于列表中插入的歌曲序号
        if (currentIndex > fpindex) {
            playList.splice(fpindex, 1)
            currentIndex--
        } else {
            playList.splice(fpindex + 1, 1)
        }
    }
    // sequenceList中当前播放歌曲的索引
    let seqIndex = findSongIndex(sequenceList, currentSong)
    // 查找sequenceList中有没有song歌曲
    let fsindex = findSongIndex(sequenceList, song)
     // 把song插入到sequenceList中
    seqIndex++
    sequenceList.splice(seqIndex, 0, song)
    // sequenceList存在插入的歌曲
    if (fsindex > -1) {
        // 插入歌曲的序号大于列表中插入的歌曲序号
        if (seqIndex > fsindex) {
            sequenceList.splice(fsindex, 1)
        } else {
            sequenceList.splice(fsindex + 1, 1)
        }
    }
    commit(types.SET_PLAYLIST, playList)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

// 删除歌曲
export const deleteSong = function({commit, state}, song) {
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    const fpIndex = findSongIndex(playList, song)
    playList.splice(fpIndex, 1)

    const fsIndex = findSongIndex(sequenceList, song)
    sequenceList.splice(fsIndex, 1)

    if (currentIndex > fpIndex || currentIndex === playList.length) {
        currentIndex--
    }

    commit(types.SET_PLAYLIST, playList)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)

    const playingState = playList.length > 0
    commit(types.SET_PLAYING_STATE, playingState)
}

// 清空歌曲
export const clearSong = function({commit}) {
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
}

// 存储搜索记录
export const saveSearchQuery = function({commit}, query) {
    commit(types.SET_SEARCH_HISTROY, saveSearchHistory(query))
}

// 删除搜索记录
export const deleteSearchQuery = function({commit}, query) {
    commit(types.SET_SEARCH_HISTROY, deleteSearchHistory(query))
}

// 清空搜索记录
export const clearSearchQuery = function({commit}) {
    commit(types.SET_SEARCH_HISTROY, clearSearchHistory())
}