<template>
  <transition name="addSong-fade">
      <div class="add-song" v-show="showFlag" @click.stop>
          <div class="header">
              <h1 class="title">添加歌曲到列表</h1>
              <div class="close" @click="hide">
                <i class="icon-no"></i>
            </div>
          </div>
          <div class="search-box-wrapper">
              <search-box @query="onQueryChange" placeholder="搜索歌曲" ref="searchBox"></search-box>
          </div>
          <div class="shortcut" v-show="!query">
              <switches :switches="switches" :currentIndex="switchIndex" @switch="switchSelect"></switches>
              <div class="list-wrapper">
                <scroll ref="songList" v-if="switchIndex === 0" :data="playHistory" class="list-scroll">
                    <div class="list-inner">
                        <song-list :songs="playHistory" @select="savePlay"></song-list>
                    </div>
                </scroll>
                <scroll ref="searchList" v-if="switchIndex === 1" class="list-scroll" :refreshDelay="refreshDelay" :data="searchHistory">
                    <div class="list-inner">
                        <search-list :searches="searchHistory" @select="addQuery" @selectClose="deleteSearchQuery"></search-list>
                    </div>
                </scroll>
              </div>
          </div>
          <div class="search-result" v-show="query">
              <suggest :query="query" ref="suggest" :showSinger="showSinger" @listScroll="blurInput" @select="selectSuggest"></suggest>
          </div>
          <top-tip ref="topTip">
              <div class="tip-title">
                  <i class="icon-ok"></i>
                  <span class="text">1首歌曲已经添加到播放列表</span>
              </div>
          </top-tip>
      </div>
  </transition>
</template>

<script type="text/ecmascript-6">
    import SearchBox from 'base/search-box/search-box'
    import {searchMixin} from 'common/js/mixin'
    import Suggest from 'components/suggest/suggest'
    import Switches from 'base/switches/switches'
    import Scroll from 'base/scroll/scroll'
    import SongList from 'base/song-list/song-list'
    import SearchList from 'base/search-list/search-list'
    import Song from 'common/js/song'
    import TopTip from 'base/top-tip/top-tip'
    import {mapGetters, mapActions} from 'vuex'

    export default {
        mixins: [searchMixin],
        data() {
            return {
                showFlag: false,
                query: '',
                showSinger: false,
                switchIndex: 0,
                switches: [
                    {name: '最近播放'},
                    {name: '搜索历史'}
                ]
            }
        },
        computed: {
            ...mapGetters([
                'playHistory'
            ])
        },
        methods: {
            show() {
                this.showFlag = true
                setTimeout(() => {
                    if (this.switchIndex === 0) {
                        this.$refs.songList.refresh()
                    } else {
                        this.$refs.searchList.refresh()
                    }
                }, 20)
            },
            showTip() {
                this.$refs.topTip.show()
            },
            hide() {
                this.showFlag = false
            },
            selectSuggest() {
                this.saveSearch()
                this.showTip()
            },
            switchSelect(index) {
                this.switchIndex = index
            },
            savePlay(song, index) {
                // 此song是从stroage取出来的对象，而不是song的实例，所以需要重新new一个song实例
                if (index !== 0) {
                    this.insertSong(new Song(song))
                    this.showTip()
                }
            },
            ...mapActions([
                'insertSong'
            ])
        },
        components: {
            SearchBox,
            Suggest,
            Switches,
            Scroll,
            SongList,
            SearchList,
            TopTip
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @import '~common/stylus/variable'

    .add-song
        position: fixed
        top: 0
        bottom: 0
        width: 100%
        z-index: 200
        background: $color-background
        &.addSong-fade-enter-active, &.addSong-fade-leave-active
            transition: all 0.3s
        &.addSong-fade-enter, &.addSong-fade-leave-to
            transform: translate3d(100%, 0, 0)
        .header
            position: relative
            height: 44px
            text-align: center
            .title
                line-height: 44px
                color: $color-text
                font-size: $font-size-large
            .close
                position: absolute
                top: 0
                right: 8px
                padding: 12px
                .icon-no
                    color: $color-theme
                    font-size: 20px
        .search-box-wrapper
            margin: 20px
        .shortcut
            .list-wrapper
                position: absolute
                top: 165px
                bottom: 0
                width: 100%
                .list-scroll
                    height: 100%
                    overflow: hidden
                    .list-inner
                        padding:20px 30px
        .search-result
            position: fixed
            top: 124px
            bottom: 0
            width: 100%
        .tip-title
            padding: 18px 0
            font-size: 0
            text-align: center
            .icon-ok
                margin-right: 4px
                color: $color-theme
                font-size: $font-size-medium
            .text
                color: $color-text
                font-size: $font-size-medium

</style>


