<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox"></search-box>
        </div>
        <div class="shortcut-wrapper">
            <div class="shortcut">
                <div class="hot-key">
                    <h1 class="title">热门搜索</h1>
                    <ul>
                        <li v-for="item in hotKey" class="item" @click="addQuery(item.k)">
                            <span>{{item.k}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import SearchBox from 'base/search-box/search-box'
    import {getHotKey} from 'api/search'
    import {ERR_OK} from 'api/config'
    export default {
        data() {
            return {
                hotKey: []
            }
        },
        created() {
            this._getHotKey()
        },
        methods: {
            addQuery(key) {
                this.$refs.searchBox.setQuery(key)
            },
            _getHotKey() {
                getHotKey().then((res) => {
                    if (res.code === ERR_OK) {
                        this.hotKey = res.data.hotkey.slice(0, 10)
                    }
                })
            }
        },
        components: {
            SearchBox
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '~common/stylus/variable'
    .search
        .search-box-wrapper
            margin: 20px
        .shortcut-wrapper
            position: fixed
            top: 178px
            botton: 0
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


</style>
