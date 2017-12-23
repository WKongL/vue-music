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
                <div class="middle">
                    <div class="middle-l">
                        <div class="cd-wrapper">
                            <div class="cd" :class="cdCls">
                                <img :src="currentSong.image" alt="" class="image">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="progress-wrapper">
                        <div class="time time-l">{{format(currentTime)}}</div>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                        </div>
                        <div class="time time-r">{{format(currentSong.duration)}}</div>
                    </div>
                    <div class="operators">
                        <div class="icon i-left">
                            <i class="icon-sequence"></i>
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
                        <div class="icon i-right">
                            <i class="icon-not-like"></i>
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
                <div class="control">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime"></audio>
    </div>
</template>

<script text="text/ecmascript-6">
    import {mapGetters, mapMutations} from 'vuex'
    import progressBar from 'base/progress-bar/progress-bar'
    import progressCircle from 'base/progress-circle/progress-circle'

    export default {
        data() {
            return {
                songReady: false,
                currentTime: 0
            }
        },
        computed: {
            cdCls() {
                return this.playing ? 'play' : 'play pause'
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
                'playList',
                'currentSong',
                'playing',
                'currentIndex'
            ])
        },
        methods: {
            back() {
                this.setFullScreen(false)
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
                this.$refs.audio.currentTime = this.currentSong.duration * percent
                if (!this.playing) {
                    this.togglePlaying()
                }
            },
            open() {
                this.setFullScreen(true)
            },
            togglePlaying() {
                if (!this.songReady) {
                    return
                }
                this.setPlaying(!this.playing)
            },
            next() {
                if (!this.songReady) {
                    return
                }
                let index = this.currentIndex + 1
                if (index === this.playList.length) {
                    index = 0
                }
                this.setCurrentIndex(index)
                if (!this.playing) {
                    this.togglePlaying()
                }
                this.songReady = false
            },
            prev() {
                if (!this.songReady) {
                    return
                }
                let index = this.currentIndex - 1
                if (index === -1) {
                    index = this.playList.length - 1
                }
                this.setCurrentIndex(index)
                if (!this.playing) {
                    this.togglePlaying()
                }
                this.songReady = false
            },
            ready() {
                // 控制歌曲切换
                this.songReady = true
            },
            error() {
                // 预防特殊错误，导致不能切换歌曲
                this.songReady = true
            },
            ...mapMutations({
                setFullScreen: 'SET_FULL_SCREEN',
                setPlaying: 'SET_PLAYING_STATE',
                setCurrentIndex: 'SET_CURRENT_INDEX'
            })
        },
        watch: {
            currentSong() {
                this.$nextTick(() => {
                    this.$refs.audio.play()
                })
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
            progressCircle
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
            .bottom
                position: absolute
                bottom: 50px
                width: 100%
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

