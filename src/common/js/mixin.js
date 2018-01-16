import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

// 监视playlist的mixin
export const playListMixin = {
    computed: {
        ...mapGetters([
            'playList'
        ])
    },
    mounted() {
        this.handlePlayList(this.playList)
    },
    activated() {
        this.handlePlayList(this.playList)
    },
    watch: {
        playList(newVal) {
            this.handlePlayList(newVal)
        }
    },
    methods: {
        handlePlayList() {
            throw new Error('component must implement handlePlayList method')
        }
    }
}

// 播放模式切换的按钮mixin
export const playerMixin = {
    computed: {
        iconMode() {
            return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
        },
        ...mapGetters([
            'playList',
            'sequenceList',
            'currentSong',
            'mode'
        ])
    },
    methods: {
        // 改变播放模式
        changeMode() {
            const mode = (this.mode + 1) % 3
            this.setPlayMode(mode)
            let list = null
            if (this.mode === playMode.random) {
                list = shuffle(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            // console.log(this.playList[0].name)
            this.resetCurrnetIndex(list)
            this.setPlayList(list)
            // console.log(this.playList[0].name)
        },
        // 获取当前播放歌曲在list中的索引，并把索引设置到currentIndex
        resetCurrnetIndex(list) {
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        ...mapMutations({
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAYLIST',
            setPlayingState: 'SET_PLAYING_STATE'
        })
    }
}

// 搜索框与搜索结果mixin
export const searchMixin = {
    data() {
        return {
            query: '',
            refreshDelay: 200
        }
    },
    computed: {
        ...mapGetters([
            'searchHistory'
        ])
    },
    methods: {
        blurInput() {
            this.$refs.searchBox.blur()
        },
        addQuery(key) {
            this.$refs.searchBox.setQuery(key)
        },
        onQueryChange(query) {
            this.query = query
        },
        saveSearch() {
            this.saveSearchQuery(this.query)
        },
        ...mapActions([
            'saveSearchQuery',
            'deleteSearchQuery'
        ])
    }
}