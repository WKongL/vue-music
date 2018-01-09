<template>
    <div class="no-result">
        <div class="icon"></div>
        <p class="text">{{title}}</p>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            title: {
                type: String,
                default: ''
            }
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @import '~common/stylus/mixin'
    @import '~common/stylus/variable'

    .no-result
        text-align: center
        .icon
            margin: 0 auto
            height: 90px
            width: 86px
            bg-image('no-result')
            background-repeat: no-repeat
            background-size: 86px 90px
            background-position: center
        .text
            margin-top: 30px
            color: $color-text-d
            font-size: $font-size-medium
</style>

