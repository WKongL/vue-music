<template>
  <div class="search-box">
      <i class="icon-Search"></i>
      <input type="text" v-model="query" class="box" :placeholder="placeholder" ref="input" />
      <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
    import {deBounce} from 'common/js/util'

    export default {
        props: {
            placeholder: {
                type: String,
                default: '搜索歌曲、歌手'
            }
        },
        data() {
            return {
                query: ''
            }
        },
        methods: {
            setQuery(query) {
                this.query = query
            },
            clear() {
                this.query = ''
            },
            blur() {
                this.$refs.input.blur()
            }
        },
        created() {
            this.$watch('query', deBounce((newQuery) => {
                this.$emit('query', newQuery)
            }, 300))
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '~common/stylus/variable.styl'
    .search-box
        display: flex
        align-items: center
        box-sizing: border-box
        width: 100%
        height: 40px
        padding: 0 6px
        background: $color-highlight-background
        border-radius: 6px
        .icon-Search
            font-size: 24px
            color: $color-text-l
        .box
            flex: 1
            margin: 0 5px
            line-height: 18px
            outline: 0
            background : $color-highlight-background
            color: $color-text
            font-size: $font-size-medium
            &::placeholder
                color: $color-text-d
        .icon-dismiss
            font-size: 16px
            color: $color-text-l
</style>


