<template>
  <div class="search-list" v-show="searches.length">
      <ul>
          <li v-for="item in searches" class="search-item" @click="selectItem(item)">
              <span class="text">{{item}}</span>
              <span class="close" @click.stop="clickClose(item)">
                  <i class="icon-close"></i>
              </span>
          </li>
      </ul>
  </div>
</template>

<script type="style/ecmascript-6">
    export default {
        props: {
            searches: {
                type: Array,
                default: []
            }
        },
        methods: {
            selectItem(item) {
                this.$emit('select', item)
            },
            clickClose(item) {
                this.$emit('selectClose', item)
            }
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @import '~common/stylus/mixin'
    @import '~common/stylus/variable'
    .search-list
        .search-item
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-small
            .text
                flex: 1
                color: $color-text-l
            .close
                extend-click()
                .icon-close
                    color: $color-text-d
</style>


