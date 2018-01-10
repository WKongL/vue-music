<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
            <scroll class="shortcut" :data="shortcutData" ref="shortcut">
                <div>
                    <div class="hot-key">
                        <h1 class="title">热门搜索</h1>
                        <ul>
                            <li v-for="item in hotKey" class="item" @click="addQuery(item.k)">
                                <span>{{item.k}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="search-history" v-show="searchHistory.length">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="showConfirm">
                                <i class="icon-clear"></i>
                            </span>
                        </h1>
                        <search-list :searches="searchHistory" @select="addQuery" @selectClose="deleteSearchQuery"></search-list>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
            <suggest @listScroll="blurInput" @select="saveSearch" :query="query" ref="suggest"></suggest>
        </div>
        <confirm text="是否清空所有搜索历史" confirmBtnText="清空" ref="confirm" @confirm="clearSearchQuery"></confirm>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import SearchBox from 'base/search-box/search-box'
    import {getHotKey} from 'api/search'
    import {ERR_OK} from 'api/config'
    import Suggest from 'components/suggest/suggest'
    import SearchList from 'base/search-list/search-list'
    import Confirm from 'base/confirm/confirm'
    import Scroll from 'base/scroll/scroll'
    import {playListMixin} from 'common/js/mixin'
    import {mapActions, mapGetters} from 'vuex'

    export default {
        mixins: [playListMixin],
        data() {
            return {
                hotKey: [],
                query: ''
            }
        },
        created() {
            this._getHotKey()
        },
        computed: {
            shortcutData() {
                return this.hotKey.concat(this.searchHistory)
            },
            ...mapGetters([
                'searchHistory'
            ])
        },
        methods: {
            handlePlayList(playlist) {
                const bottom = playlist.length > 0 ? '60px' : ''
                this.$refs.shortcutWrapper.style.bottom = bottom
                this.$refs.shortcut.refresh()
                this.$refs.searchResult.style.bottom = bottom
                this.$refs.suggest.refresh()
            },
            addQuery(key) {
                this.$refs.searchBox.setQuery(key)
            },
            blurInput() {
                this.$refs.searchBox.blur()
            },
            onQueryChange(query) {
                this.query = query
            },
            saveSearch() {
                this.saveSearchQuery(this.query)
            },
            _getHotKey() {
                getHotKey().then((res) => {
                    if (res.code === ERR_OK) {
                        this.hotKey = res.data.hotkey.slice(0, 10)
                    }
                })
            },
            showConfirm() {
                this.$refs.confirm.show()
            },
            ...mapActions([
                'saveSearchQuery',
                'deleteSearchQuery',
                'clearSearchQuery'
            ])
        },
        watch: {
            query(newQuery) {
                if (!newQuery) {
                    setTimeout(() => {
                        this.$refs.shortcut.refresh()
                    }, 20)
                }
            }
        },
        components: {
            SearchBox,
            Suggest,
            SearchList,
            Confirm,
            Scroll
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '~common/stylus/variable'
    @import '~common/stylus/mixin'
    .search
        .search-box-wrapper
            margin: 20px
        .shortcut-wrapper
            position: fixed
            top: 178px
            bottom: 0
            width: 100%
            .shortcut
                height: 100%
                overflow: hidden
                .hot-key
                    margin: 0 20px 20px 20px
                    .title
                        margin-bottom: 20px
                        color: $color-text-l
                        font-size: $font-size-medium
                    .item
                        display: inline-block
                        padding: 5px 10px
                        margin: 0 20px 10px 0
                        border-radius: 6px
                        color: $color-text-d
                        font-size: $font-size-medium
                        background: $color-highlight-background
                .search-history
                    margin: 0 20px
                    .title
                        display: flex
                        align-items: center
                        height: 40px
                        color: $color-text-l
                        font-size: $font-size-medium
                        .text
                            flex: 1
                        .clear
                            extend-click()
                            .icon-clear
                                color: $color-text-d
        .search-result
            position: fixed
            top: 178px
            bottom: 0
            width:100%
</style>
