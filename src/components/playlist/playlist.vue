<template>
  <transition name="list-fade">
      <div class="playlist" v-show="showFlag" @click="hide">
          <div class="playlist-wrapper" @click.stop>
              <div class="list-header">
                  <i class="icon" :class="iconMode" @click="changeMode"></i>
                  <span class="text">{{modeText}}</span>
                  <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
              </div>
              <scroll class="list-content" :refreshDelay="refreshDelay" :data="sequenceList" ref="listContent">
                  <transition-group name="list" tag="ul">
                      <li :key="item.id" class="list-item" v-for="(item, index) in sequenceList" @click="selectItem(item, index)" ref="listItem">
                          <i class="current" :class="getCurrentIcon(item)"></i>
                          <span class="text">{{item.name}}-{{item.singer}}</span>
                          <span class="like" @click.stop="toggleFavorite(item)">
                              <i :class="getFavoriteIcon(item)"></i>
                          </span>
                          <span class="delete" @click.stop="deleteOne(item)">
                              <i class="icon-close"></i>
                          </span>
                      </li>
                  </transition-group>
              </scroll>
              <div class="list-operate">
                  <div class="add" @click="showAddSong">
                      <i class="icon-add"></i>
                      <span class="text">添加歌曲到列表</span>
                  </div>
              </div>
              <div class="list-close" @click="hide">
                  <span>关闭</span>
              </div>
          </div>
          <confirm text="是否清空播放列表" confirmBtnText="清空" ref="confirm" @confirm="confirmClear"></confirm>
          <add-song ref="addSong"></add-song>
      </div>
  </transition>
</template>

<script type="text/ecmascript-6">
    import Scroll from 'base/scroll/scroll'
    import Confirm from 'base/confirm/confirm'
    import AddSong from 'components/add-song/add-song'
    import {playMode} from 'common/js/config'
    import {playerMixin} from 'common/js/mixin'
    import {mapActions} from 'vuex'

    export default {
        mixins: [playerMixin],
        data() {
            return {
                showFlag: false,
                refreshDelay: 100
            }
        },
        computed: {
            modeText() {
                return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
            }
        },
        methods: {
            show() {
                this.showFlag = true
                setTimeout(() => {
                    this.$refs.listContent.refresh()
                    this.scrollToCurrent(this.currentSong)
                }, 20)
            },
            hide() {
                this.showFlag = false
            },
            showConfirm() {
                this.$refs.confirm.show()
            },
            showAddSong() {
                this.$refs.addSong.show()
            },
            getCurrentIcon(item) {
                if (item.id === this.currentSong.id) {
                    return 'icon-play'
                } else {
                    return ''
                }
            },
            deleteOne(item) {
                this.deleteSong(item)
                if (!this.playList.length) {
                    this.hide()
                }
            },
            confirmClear() {
                this.clearSong()
                this.hide()
            },
            selectItem(item, index) {
                // 随机模式需要再playlist中查找选择歌曲的索引
                if (this.mode === playMode.random) {
                    index = this.playList.findIndex((song) => {
                        return song.id === item.id
                    })
                }
                this.setCurrentIndex(index)
                this.setPlayingState(true)
            },
            scrollToCurrent(song) {
                // 当前播放歌曲自动滚动到第一位
                let fsIndex = this.sequenceList.findIndex((item) => {
                    return item.id === song.id
                })
                this.$refs.listContent.scrollToElement(this.$refs.listItem[fsIndex], 300)
            },
            ...mapActions([
                'deleteSong',
                'clearSong'
            ])
        },
        watch: {
            currentSong(newSong, oldSong) {
                if (!this.showFlag || newSong.id === oldSong.id) {
                    return
                }
                this.scrollToCurrent(newSong)
            }
        },
        components: {
            Scroll,
            Confirm,
            AddSong
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
                    &.list-enter-active, &.list-leave-active
                        transition: all 0.1s linear
                    &.list-enter, &.list-leave-to
                        height: 0
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

