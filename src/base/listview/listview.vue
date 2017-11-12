<template>
    <scroll class="listview" :data="data" ref="listview">
        <ul>
            <li v-for="group in data" class="list-group" ref="listgroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="item in group.items" class="list-group-item">
                        <img class="avatar" v-lazy="item.avatar"/>
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li v-for="(item, index) in shortcutList" class="item" :data-index="index">{{item}}</li>
            </ul>
        </div>
    </scroll>
</template>

<script type="text/ecmascript-6">
    import scroll from 'base/scroll/scroll'
    import {getData} from 'common/js/dom'

    const ANCHOR_HEIGHT = 18

    export default {
        props: {
            data: {
                type: Array,
                default: []
            }
        },
        created() {
            this.touch = {}
        },
        computed: {
            shortcutList() {
                return this.data.map((item) => {
                    return item.title.substr(0, 1)
                })
            }
        },
        methods: {
            onShortcutTouchStart(e) {
                let anchorIndex = getData(e.target, 'index')
                let firstTouch = e.touches[0]
                this.touch.y1 = firstTouch.pageY
                this.touch.anchorIndex = anchorIndex
                this._scrollTo(anchorIndex)
            },
            onShortcutTouchMove(e) {
                let firstTouch = e.touches[0]
                this.touch.y2 = firstTouch.pageY
                let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
                let anchorIndex = parseInt(this.touch.anchorIndex) + delta
                this._scrollTo(anchorIndex)
            },
            _scrollTo(index) {
                this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
            }
        },
        components: {
            scroll
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '~common/stylus/variable.styl'
    .listview
        position: relative
        width: 100%
        height: 100%
        overflow: hidden
        background: $color-background
        .list-group
            padding-bottom: 30px
            .list-group-title
                height: 30px
                line-height: 30px
                padding-left: 20px
                font-size: $font-size-small
                color: $color-text-l
                background: $color-highlight-background
            .list-group-item
                display: flex
                align-items: center
                padding: 20px 0 0 30px
                .avatar
                    width: 50px
                    height: 50px
                    border-radius: 50%
                .name
                    margin-left: 20px
                    color: $color-text-l
                    font-size: $font-size-medium
        .list-shortcut
            position: absolute
            z-index: 30
            top: 50%
            right: 0
            transform: translateY(-50%)
            width: 20px
            padding: 20px 0
            border-radius: 10px
            text-align: center
            background: $color-background-d
            font-family: Helvetica
            .item
                padding: 3px
                color: $color-text-l
                font-size: $font-size-small
</style>