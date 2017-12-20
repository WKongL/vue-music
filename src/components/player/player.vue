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
                    <div class="operators">
                        <div class="icon i-left">
                            <i class="icon-sequence"></i>
                        </div>
                        <div class="icon i-left">
                            <i class="icon-prev"></i>
                        </div>
                        <div class="icon i-center">
                            <i :class="playIcon" @click="togglePlaying"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon-next"></i>
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
                    <i :class="miniPlayIcon" @click.stop="togglePlaying"></i>
                </div>
                <div class="control">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <audio ref="audio" :src="currentSong.url"></audio>
    </div>
</template>

<script text="text/ecmascript-6">
    import {mapGetters, mapMutations} from 'vuex'
    
    export default {
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
            ...mapGetters([
                'fullScreen',
                'playList',
                'currentSong',
                'playing'
            ])
        },
        methods: {
            back() {
                this.setFullScreen(false)
            },
            open() {
                this.setFullScreen(true)
            },
            togglePlaying() {
                this.setPlaying(!this.playing)
            },
            ...mapMutations({
                setFullScreen: 'SET_FULL_SCREEN',
                setPlaying: 'SET_PLAYING_STATE'
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
                .operators
                    display: flex
                    align-items: center    
                    .icon
                        flex: 1
                        color: $color-theme
                        i 
                            font-size: 30px
                    .i-left   
                        text-align: right 
                    .i-center
                        padding: 0 20px
                        text-align: center
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

    @keyframes rotate
        0%
            transform: rotate(0)
        100%
            transform: rotate(360deg)
</style>

