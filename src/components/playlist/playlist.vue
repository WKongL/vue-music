<template>
  <transition name="list-fade">
      <div class="playlist" v-show="showFlag" @click="hide">
          <div class="playlist-wrapper" @click.stop>
              <div class="list-header">
                  <i class="icon icon-sequence"></i>
                  <span class="text">11</span>
                  <span class="clear"><i class="icon-clear"></i></span>
              </div>
              <div class="list-content">
                  <ul>
                      <li class="list-item">
                          <i class="current"></i>
                          <span class="text"></span>
                          <span class="like">
                              <i class="icon-not-like"></i>
                          </span>
                          <span class="delete">
                              <i class="icon-close"></i>
                          </span>
                      </li>
                  </ul>
              </div>
              <div class="list-operate">
                  <div class="add">
                      <i class="icon-add"></i>
                      <span class="text">添加歌曲到队列</span>
                  </div>
              </div>
              <div class="list-close" @click="hide">
                  <span>关闭</span>
              </div>
          </div>
      </div>
  </transition>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                showFlag: false
            }
        },
        methods: {
            show() {
                this.showFlag = true
            },
            hide() {
                this.showFlag = false
            }
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @import '~common/stylus/variable'
    @import '~common/stylus/mixin'
    .playlist
        position: fixed
        top: 0
        left: 0
        right: 0
        bottom: 0
        z-index: 200
        background: $color-background-d
        &.list-fade-enter-active, &.list-fade-leave-active
            transition: opacity 0.3s
            .playlist-wrapper
                transition: all 0.3s
        &.list-fade-enter, &.list-fade-leave-to
            opacity: 0
            .playlist-wrapper
                transform: translate3d(0, 100%, 0)
        .playlist-wrapper
            position: absolute
            left: 0
            bottom: 0
            width: 100%
            background: $color-highlight-background
            .list-header
                display: flex
                align-items: center
                padding: 20px 30px 10px 20px
                .icon
                    margin-right: 10px
                    font-size: 30px
                    color: $color-theme-d
                .text
                    flex: 1
                    font-size: $font-size-medium
                    color: $color-text-l
                .clear
                    extend-click()
                    .icon-clear
                        font-size: $font-size-medium
                        color: $color-text-d
            .list-content
                max-height: 240px
                overflow: hidden
                .list-item
                    display: flex
                    align-items: center
                    padding: 0 30px 0 20px
                    height: 40px
                    .current
                        flex: 0 0 20px
                        width: 20px
                        font-size: $font-size-small
                        color: $color-theme-d
                    .text
                        flex: 1
                        no-wrap()
                        font-size: $font-size-medium
                        color: $color-text-d
                    .like
                        extend-click()
                        margin-right: 15px
                        font-size: $font-size-small
                        color: $color-theme
                        .icon-like
                            color: $color-sub-theme
                    .delete
                        extend-click()
                        font-size: $font-size-small
                        color: $color-theme
            .list-operate
                width: 140px
                margin: 20px auto 30px
                .add
                    display: flex
                    align-items: center
                    padding: 8px 16px
                    border-radius: 100px
                    border: 1px solid $color-text-l
                    color: $color-text-l
                    .icon-add
                        margin-right: 5px
                        font-size: $font-size-small-s
                    .text
                        font-size: $font-size-small
            .list-close
                text-align: center
                line-height: 50px
                color: $color-text-l
                font-size: $font-size-medium-x
                background: $color-background
                
</style>

