<template>
    <div class="song-list">
        <ul>
            <li @click="selectItem(song, index)" class="item" v-for="(song, index) in songs">
                <div class="content">
                    <h1 class="name">{{song.name}}</h1>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        props: {
            songs: {
                type: Array,
                default: []
            }
        },
        methods: {
            selectItem(item, index) {
                this.$emit('select', item, index)
            },
            getDesc(song) {
                return `${song.singer}.${song.album}`
            }
        }
    }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
    @import '~common/stylus/mixin.styl'
    @import '~common/stylus/variable.styl'
    .song-list
        .item
            display: flex
            align-items: center
            box-sizing: border-box
            height: 64px
            font-size: $font-size-medium
            .content
                flex: 1
                line-height: 20px
                overflow: hidden
                .name
                    no-wrap()
                    color: $color-text
                .desc
                    no-wrap()
                    margin-top: 4px
                    color: $color-text-d
</style>