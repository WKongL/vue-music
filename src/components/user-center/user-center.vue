<template>
  <transition name="user-fade">
      <div class="user-center">
          <div class="back" @click="back">
              <i class="icon-back"></i>
          </div>
          <div class="switch-wrapper">
              <switches :switches="switches" :currentIndex="switchIndex" @switch="switchSelect"></switches>
          </div>
          <div class="play-btn" @click="randomClick">
              <i class="icon-play"></i>
              <span class="text">随机播放全部</span>
          </div>
          <div class="list-wrapper" ref="listWrapper">
              <scroll class="list-scroll" v-if="switchIndex === 0" ref="favoriteScroll" :data="favoriteList">
                  <div class="list-inner">
                      <song-list :songs="favoriteList" @select="selectItem"></song-list>
                  </div>
              </scroll>
              <scroll class="list-scroll" v-if="switchIndex === 1" ref="playScroll" :data="playHistory">
                  <div class="list-inner">
                      <song-list :songs="playHistory" @select="selectItem"></song-list>
                  </div>
              </scroll>
          </div>
          <div class="no-result-wrapper" v-show="noResultDisplay">
              <no-result :title="noResultText"></no-result>
          </div>
      </div>
  </transition>
</template>

<script type="text/ecmascript-6">
    import Switches from 'base/switches/switches'
    import SongList from 'base/song-list/song-list'
    import Scroll from 'base/scroll/scroll'
    import NoResult from 'base/no-result/no-result'
    import Song from 'common/js/song'
    import {playListMixin} from 'common/js/mixin'
    import {mapGetters, mapActions} from 'vuex'

    export default {
        mixins: [playListMixin],
        data() {
            return {
                switches: [
                    {name: '我喜欢的'},
                    {name: '最近听的'}
                ],
                switchIndex: 0
            }
        },
        computed: {
            noResultText() {
                if (this.switchIndex === 0) {
                    return '暂无收藏歌曲'
                } else {
                    return '您还没有听过歌曲'
                }
            },
            noResultDisplay() {
                if (this.switchIndex === 0) {
                    return !this.favoriteList.length
                } else {
                    return !this.playHistory.length
                }
            },
            ...mapGetters([
                'favoriteList',
                'playHistory'
            ])
        },
        methods: {
            handlePlayList(playlist) {
                const bottom = playlist.length > 0 ? '60px' : ''
                this.$refs.listWrapper.style.bottom = bottom
                this.$refs.favoriteScroll && this.$refs.favoriteScroll.refresh()
                this.$refs.playScroll && this.$refs.playScroll.refresh()
            },
            back() {
                this.$router.back()
            },
            switchSelect(index) {
                this.switchIndex = index
            },
            selectItem(song, index) {
                this.insertSong(new Song(song))
            },
            randomClick() {
                let list = this.switchIndex === 0 ? this.favoriteList : this.playHistory
                if (list.length === 0) {
                    return
                }
                list = list.map((song) => {
                    return new Song(song)
                })
                this.randomPlay({
                    list
                })
            },
            ...mapActions([
                'insertSong',
                'randomPlay'
            ])
        },
        components: {
            Switches,
            SongList,
            Scroll,
            NoResult
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
        .list-wrapper
            position: absolute
            top: 110px
            bottom: 0
            width: 100%
            .list-scroll
                height: 100%
                overflow: hidden
                .list-inner
                    padding: 20px 30px
        .no-result-wrapper
            position: absolute
            top: 50%
            width: 100%
            transform: translateY(-50%)
</style>


