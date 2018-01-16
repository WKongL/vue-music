<template>
  <transition name="tip-fade">
      <div class="top-tip" v-show="showFlag" @click.stop="hide">
          <slot></slot>
      </div>
  </transition>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            delay: {
                type: Number,
                default: 2000
            }
        },
        data() {
            return {
                showFlag: false
            }
        },
        methods: {
            show() {
                this.showFlag = true
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.hide()
                }, this.delay)
            },
            hide() {
                this.showFlag = false
            }
        }
    }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
    @import '~common/stylus/variable'

    .top-tip
        position: fixed
        top: 0
        width: 100%
        background: $color-dialog-background
        &.tip-fade-enter-active, &.tip-fade-leave-active
            transition: all 0.3s
        &.tip-fade-enter, &.tip-fade-leave-to
            transform: translate3d(0, -100%, 0)
</style>


