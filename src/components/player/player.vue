<template>
    <div class="player" v-show="playList.length>0">
        <transition name="normal">
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img :src="currentSong.image" >
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subTitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle" @touchstart="middleTouchStart" @touchmove="middleTouchMove" @touchend="middleTouchEnd">
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper">
                            <div class="cd" :class="cdCls">
                                <img :src="currentSong.image" alt="" class="image">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{playingLyric}}</div>
                        </div>
                    </div>
                    <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p  ref="lyricLine" 
                                    class="text" 
                                    :class="{'current': currentLineNum === index}"
                                    v-for="(line, index) in currentLyric.lines">{{line.txt}}</p>
                            </div>
                        </div>
                    </scroll>   
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
                        <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
                    </div>
                    <div class="progress-wrapper">
                        <div class="time time-l">{{format(currentTime)}}</div>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                        </div>
                        <div class="time time-r">{{format(currentSong.duration)}}</div>
                    </div>
                    <div class="operators">
                        <div class="icon i-left">
                            <i :class="iconMode" @click="changeMode"></i>
                        </div>
                        <div class="icon i-left" :class="disableCls">
                            <i class="icon-prev" @click="prev"></i>
                        </div>
                        <div class="icon i-center" :class="disableCls">
                            <i :class="playIcon" @click="togglePlaying"></i>
                        </div>
                        <div class="icon i-right" :class="disableCls">
                            <i class="icon-next" @click="next"></i>
                        </div>
                        <div class="icon i-right" @click="toggleFavorite(currentSong)">
                            <i :class="getFavoriteIcon(currentSong)"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <img :src="currentSong.image" alt="" :class="cdCls">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <progress-circle :length="32" :percent="percent">
                        <i :class="miniPlayIcon" class="icon-mini" @click.stop="togglePlaying"></i>
                    </progress-circle>
                </div>
                <div class="control" @click.stop="showPlaylist">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <playlist ref="playlist"></playlist>
        <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
    </div>
</template>

<script text="text/ecmascript-6">
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import progressBar from 'base/progress-bar/progress-bar'
    import progressCircle from 'base/progress-circle/progress-circle'
    import {playMode} from 'common/js/config'
    import Lyric from 'lyric-parser'
    import Scroll from 'base/scroll/scroll'
    import Playlist from 'components/playlist/playlist'
    import {playerMixin} from 'common/js/mixin'
    import {prefixStyle} from 'common/js/dom'

    const transform = prefixStyle('transform')
    const transitionDuration = prefixStyle('transitionDuration')

    export default {
        mixins: [playerMixin],
        data() {
            return {
                songReady: false,
                currentTime: 0,
                currentLyric: null,
                currentLineNum: 0,
                currentShow: 'cd',
                playingLyric: ''
            }
        },
        created() {
            // touch事件之间的桥梁
            this.touch = {}
        },
        computed: {
            cdCls() {
                return this.playing ? 'play' : 'play pause'
            },
            iconMode() {
                return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
            },
            miniPlayIcon() {
                return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
            },
            playIcon() {
               return this.playing ? 'icon-pause' : 'icon-play'
            },
            disableCls() {
                return this.songReady ? '' : 'disable'
            },
            percent() {
                return this.currentTime / this.currentSong.duration
            },
            ...mapGetters([
                'fullScreen',
                'playing',
                'currentIndex'
            ])
        },
        methods: {
            back() {
                this.setFullScreen(false)
            },
            middleTouchStart(e) {
                this.touch.initiated = true // 用来判断是否开始touch
                const touch = e.touches[0]
                this.touch.startX = touch.pageX
                this.touch.startY = touch.pageY
            },
            middleTouchMove(e) {
                if (!this.touch.initiated) {
                    return
                }
                const touch = e.touches[0]
                // console.log(touch.pageX)
                const moveX = touch.pageX - this.touch.startX
                const moveY = touch.pageY - this.touch.startY
                // 如果纵轴移动距离比横轴移动距离大，则不处理。
                if (Math.abs(moveY) > Math.abs(moveX)) {
                    return
                }
                // 歌词本来位置的left，不是0就是屏幕本身宽度的负值
                const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
                // 歌词移动的范围是0到屏幕的负值宽度
                const moveWidth = Math.min(0, Math.max(-window.innerWidth, left + moveX))
                this.touch.percent = Math.abs(moveWidth / window.innerWidth)
                this.$refs.middleL.style.opacity = 1 - this.touch.percent
                this.$refs.middleL.style[transitionDuration] = 0
                this.$refs.lyricList.$el.style[transform] = `translate3d(${moveWidth}px, 0, 0)`
                this.$refs.lyricList.$el.style[transitionDuration] = 0
            },
            middleTouchEnd() {
                let moveWidth
                let opacity
                const time = 300
                // 移动距离超过10%则自动移动到最后
                if (this.currentShow === 'cd') {
                    if (this.touch.percent > 0.1) {
                        moveWidth = -window.innerWidth
                        this.currentShow = 'lyric'
                        opacity = 0
                    } else {
                        moveWidth = 0
                        opacity = 1
                    }
                } else {
                    if (this.touch.percent < 0.9) {
                        moveWidth = 0
                        this.currentShow = 'cd'
                        opacity = 1
                    } else {
                        moveWidth = -window.innerWidth
                        opacity = 0
                    }
                }
                this.$refs.lyricList.$el.style[transform] = `translate3d(${moveWidth}px, 0, 0)`
                this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
                this.$refs.middleL.style.opacity = opacity
                this.$refs.middleL.style[transitionDuration] = `${time}ms`
                this.touch.initiated = false
            },
            updateTime(e) {
                this.currentTime = e.target.currentTime
            },
            // 格式化时间
            format(data) {
                data = data | 0
                let minute = data / 60 | 0
                let second = this._pad(data % 60)
                return `${minute}:${second}`
            },
            // 根据n的数量从十位数开始添加0  例：01
            _pad(num, n = 2) {
                let len = num.toString().length
                while (len < n) {
                    num = '0' + num
                    len++
                }
                return num
            },
            onProgressBarChange(percent) {
                const currentTime = this.currentSong.duration * percent
                this.$refs.audio.currentTime = currentTime
                if (!this.playing) {
                    this.togglePlaying()
                }
                if (this.currentLyric) {
                    this.currentLyric.seek(currentTime * 1000)
                }
            },
            open() {
                this.setFullScreen(true)
            },
            showPlaylist() {
                this.$refs.playlist.show()
            },
            togglePlaying() {
                if (!this.songReady) {
                    return
                }
                this.setPlayingState(!this.playing)
                if (this.currentLyric) {
                    this.currentLyric.togglePlay()
                }
            },
            next() {
                if (!this.songReady) {
                    return
                }
                if (this.playList.length === 1) {
                    this.loop()
                } else {
                    let index = this.currentIndex + 1
                    if (index === this.playList.length) {
                        index = 0
                    }
                    this.setCurrentIndex(index)
                    if (!this.playing) {
                        this.togglePlaying()
                    }
                }
                this.songReady = false
            },
            prev() {
                if (!this.songReady) {
                    return
                }
                if (this.playList.length === 1) {
                    this.loop()
                } else {
                    let index = this.currentIndex - 1
                    if (index === -1) {
                        index = this.playList.length - 1
                    }
                    this.setCurrentIndex(index)
                    if (!this.playing) {
                        this.togglePlaying()
                    }
                }
                this.songReady = false
            },
            end() {
                if (this.mode === playMode.loop) {
                    this.loop()
                } else {
                    this.next()
                }
            },
            loop() {
                this.$refs.audio.currentTime = 0
                this.$refs.audio.play()
                if (this.currentLyric) {
                    this.currentLyric.seek(0)
                }
            },
            ready() {
                // 控制歌曲切换
                this.songReady = true
                this.savePlayHistory(this.currentSong)
            },
            getLyric() {
                this.currentSong.getLyric().then((lyric) => {
                    this.currentLyric = new Lyric(lyric, this.handleLyric)
                    if (this.playing) {
                        this.currentLyric.play()
                    }
                }).catch(() => {
                    this.currentLyric = null
                    this.playingLyric = ''
                    this.currentLineNum = 0
                })
            },
            handleLyric({lineNum, txt}) {
                this.currentLineNum = lineNum
                if (lineNum > 5) {
                    let lineElem = this.$refs.lyricLine[lineNum - 5]
                    this.$refs.lyricList.scrollToElement(lineElem, 1000)
                } else {
                    this.$refs.lyricList.scrollTo(0, 0, 1000)
                }
                this.playingLyric = txt
            },
            error() {
                // 预防特殊错误，导致不能切换歌曲
                this.songReady = true
            },
            ...mapMutations({
                setFullScreen: 'SET_FULL_SCREEN'
            }),
            ...mapActions([
                'savePlayHistory'
            ])
        },
        watch: {
            currentSong(newSong, oldSong) {
                if (!newSong.id) {
                    return
                }
                if (newSong.id === oldSong.id) {
                    return
                }
                if (this.currentLyric) {
                    this.currentLyric.stop()
                    this.currentTime = 0
                    this.playingLyric = ''
                    this.currentLineNum = 0
                }
                setTimeout(() => {
                    this.$refs.audio.play()
                    this.getLyric()
                }, 1000)
            },
            playing(status) {
                const audio = this.$refs.audio
                this.$nextTick(() => {
                    status ? audio.play() : audio.pause()
                })
            }
        },
        components: {
            progressBar,
            progressCircle,
            Scroll,
            Playlist
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @import '~common/stylus/variable.styl'
    @import '~common/stylus/mixin.styl'
    .player
        .normal-player
            position: fixed
            left: 0
            right: 0
            bottom: 0
            top: 0
            z-index: 150
            background: $color-background
            .background
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
                z-index: -1
                opacity: 0.6
                filter: blur(20px)
                img
                    width: 100%
                    height: 100%
            .top
                position: relative
                margin-bottom: 25px
                .back
                    position: absolute
                    top: 0
                    left: 6px
                    z-index: 50
                    .icon-back
                        display: block
                        padding: 9px
                        font-size: $font-size-large-x
                        color: $color-theme
                        transform: rotate(-90deg)
                .title
                    width: 70%
                    margin: 0 auto
                    line-height: 40px
                    text-align: center
                    no-wrap()
                    font-size: $font-size-large
                    color: $color-text
                .subTitle
                    line-height: 20px
                    text-align: center
                    font-size: $font-size-medium
                    color: $color-text
            .middle
                position: fixed
                top: 80px
                bottom: 170px
                width: 100%
                white-space: nowrap
                font-size: 0
                .middle-l
                    display: inline-block
                    position: relative
                    width: 100%
                    height: 0
                    vertical-align: top
                    padding-top: 80%
                    .cd-wrapper
                        position: absolute
                        top: 0
                        left: 10%
                        width: 80%
                        height: 100%
                        box-sizing: border-box
                        .cd
                            width: 100%
                            height: 100%
                            border-radius: 50%
                            box-sizing: border-box
                            &.play
                                animation: rotate 20s linear infinite 
                            &.pause
                                animation-play-state: paused
                            .image
                                position: absolute
                                top: 0
                                left: 0
                                width: 100%
                                height: 100%
                                border-radius: 50%
                                box-sizing: border-box
                                border: 10px solid rgba(255, 255, 255, 0.1)
                    .playing-lyric-wrapper
                        margin: 30px auto 0 auto
                        width: 80%
                        overflow: hidden
                        .playing-lyric
                            height: 20px
                            line-height:20px
                            text-align: center
                            color: $color-text-l
                            font-size: $font-size-medium

                .middle-r
                    display: inline-block
                    width: 100%
                    height: 100%
                    vertical-align: top
                    overflow: hidden
                    .lyric-wrapper
                        margin: 0 auto
                        width: 80%
                        overflow: hidden
                        text-align: center
                        .text
                            line-height: 32px
                            color: $color-text-l
                            font-size: $font-size-medium
                            &.current
                                color: $color-text
            .bottom
                position: absolute
                bottom: 50px
                width: 100%
                .dot-wrapper
                    margin: 0 auto
                    width: 80%
                    text-align: center 
                    font-size: 0
                    .dot
                        display: inline-block
                        vertical-align: middle
                        margin: 0 4px
                        width: 8px
                        height: 8px
                        background: $color-text-l
                        border-radius: 50%
                        &.active
                            width: 20px
                            border-radius: 5px
                            background: $color-text-ll
                .progress-wrapper
                    display: flex
                    align-items: center
                    width: 80%
                    margin: 0 auto
                    padding: 10px 0
                    .time
                        flex: 0 0 30px
                        width: 30px
                        line-height: 30px
                        font-size: $font-size-small
                        color: $color-text
                        &.time-l
                            text-align: left
                        &.time-r
                            text-align: right 
                    .progress-bar-wrapper
                        flex: 1
                .operators
                    display: flex
                    align-items: center    
                    .icon
                        flex: 1
                        color: $color-theme
                        &.disable
                            color: $color-theme-d
                        i 
                            font-size: 30px
                        .icon-like
                            color: $color-sub-theme
                    .i-left   
                        text-align: right 
                    .i-center
                        padding: 0 20px
                        text-align: center
                        i 
                            font-size: 40px
                    .i-right
                        text-align: left
            &.normal-enter-active, &.normal-leave-active
                transition: all 0.4s
                .top, .bottom
                    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
            &.normal-enter, &.normal-leave-to
                opacity: 0
                .top      
                    transform: translate3d(0, -100px, 0)
                .bottom
                    transform: translate3d(0, 100px, 0)  
    .mini-player
        position: fixed
        bottom: 0
        left: 0
        display: flex
        align-items: center
        width: 100%
        height: 60px
        z-index: 180
        background: $color-highlight-background
        &.mini-enter-active, &.mini-leave-active
            transition: all 0.4s
        &.mini-enter, &.mini-leave-to
            opacity: 0
        .icon
            padding: 0 10px 0 20px
            flex: 0 0 40px
            width: 40px
            height: 40px
            img
                height: 100%
                width: 100%
                border-radius: 50%
                &.play
                    animation: rotate 10s linear infinite 
                &.pause
                    animation-play-state: paused
        .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            .name
                margin-bottom: 2px
                no-wrap()
                font-size: $font-size-medium
                color: $color-text
            .desc
                no-wrap()
                font-size: $font-size-small
                color: $color-text
        .control
            flex: 0 0 30px
            width: 30px
            padding: 0 10px
            .icon-play-mini,.icon-pause-mini, .icon-playlist
                font-size: 30px
                color: $color-theme-d
            .icon-mini
                position: absolute
                top: 0
                left: 0
                font-size: 32px
    @keyframes rotate
        0%
            transform: rotate(0)
        100%
            transform: rotate(360deg)
</style>

