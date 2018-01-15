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
          <div class="shortcut" v-show="!query"></div>
          <div class="search-result" v-show="query">
              <suggest :query="query" ref="suggest" :showSinger="showSinger" @listScroll="blurInput" @select="selectSuggest"></suggest>
          </div>
      </div>
  </transition>
</template>

<script type="text/ecmascript-6">
    import SearchBox from 'base/search-box/search-box'
    import {searchMixin} from 'common/js/mixin'
    import Suggest from 'components/suggest/suggest'

    export default {
        mixins: [searchMixin],
        data() {
            return {
                showFlag: false,
                query: '',
                showSinger: false
            }
        },
        methods: {
            show() {
                this.showFlag = true
            },
            hide() {
                this.showFlag = false
            },
            selectSuggest() {
                this.saveSearch()
            }
        },
        components: {
            SearchBox,
            Suggest
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
        .search-result
            position: fixed
            top: 124px
            bottom: 0
            width: 100%
</style>


