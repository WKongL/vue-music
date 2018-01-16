<template>
  <transition name="user-fade">
      <div class="user-center">
          <div class="back" @click="back">
              <i class="icon-back"></i>
          </div>
          <div class="switch-wrapper">
              <switches :switches="switches" :currentIndex="switchIndex" @switch="switchSelect"></switches>
          </div>
          <div class="play-btn">
              <i class="icon-play"></i>
              <span class="text">随机播放全部</span>
          </div>
          <div class="list-wrapper"></div>
      </div>
  </transition>
</template>

<script type="text/ecmascript-6">
    import Switches from 'base/switches/switches'
    export default {
        data() {
            return {
                switches: [
                    {name: '我喜欢的'},
                    {name: '最近听的'}
                ],
                switchIndex: 0
            }
        },
        methods: {
            back() {
                this.$router.back()
            },
            switchSelect(index) {
                this.switchIndex = index
            }
        },
        components: {
            Switches
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @import '~common/stylus/variable'

    .user-center
        position: fixed
        top: 0
        bottom: 0
        width: 100%
        z-index: 100
        background: $color-background
        &.user-fade-enter-active, &.user-fade-leave-active
            transition: all 0.3s
        &.user-fade-enter, &.user-fade-leave-to
            transform: translate3d(100%, 0, 0)
        .back
            position: absolute
            top: 0
            left: 6px
            z-index: 50
            .icon-back
                display: block
                padding: 10px
                color: $color-theme
                font-size: $font-size-large-x
        .switch-wrapper
            margin: 10px 0 30px 0
        .play-btn
            margin: 0 auto
            padding: 7px 0
            width: 135px
            box-sizing: border-box
            text-align: center
            border-radius: 100px
            border: 1px solid $color-text-l
            font-size: 0
            .icon-play
                display: inline-block
                vertical-align: middle
                margin-right: 6px
                color: $color-text-l
                font-size: $font-size-medium-x
            .text
                display: inline-block
                vertical-align: middle
                color: $color-text-l
                font-size: $font-size-small
</style>


