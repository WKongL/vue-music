<template>
  <ul class="switch">
      <li class="switch-item" v-for="(item, index) in switches" @click="selectItem(index)" :class="{'active': index === currentIndex}">
          <span class="title">{{item.name}}</span>
      </li>
  </ul>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            switches: {
                type: Array,
                default: []
            },
            currentIndex: {
                type: Number,
                default: 0
            }
        },
        methods: {
            selectItem(index) {
                this.$emit('switch', index)
            }
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @import '~common/stylus/variable'

    .switch
        display: flex
        align-items: center
        margin: 0 auto
        width: 240px
        border: 1px solid $color-highlight-background
        border-radius: 5px
        .switch-item
            flex: 1
            padding: 8px
            text-align: center
            color: $color-text-d
            font-size: $font-size-medium
            background: $color-background
            &.active
                color: $color-text
                background: $color-highlight-background
</style>


