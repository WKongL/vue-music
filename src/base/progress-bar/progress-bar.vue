<template>
  <div class="progress-bar" ref="progressBar" @click="progressBtnClick">
      <div class="bar-inner">
          <div class="progress" ref="progress"></div>
          <div class="progress-btn-wrapper" ref="progressBtn" @touchstart="progressBtnStart" @touchmove="progressBtnMove" @touchend="progressBtnEnd">
              <div class="progress-btn"></div>
          </div>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
    import {prefixStyle} from 'common/js/dom'

    const progressBtnWidth = 16
    const transform = prefixStyle('transform')

    export default {
        props: {
            percent: {
                type: Number,
                default: 0
            }
        },
        created() {
            // 用来当作touch事件之间的桥梁
            this.touch = {}
        },
        methods: {
            progressBtnClick(e) {
                this._offsetWidth(e.offsetX)
                this._triggerPercent()
            },
            progressBtnStart(e) {
                // true表示touch开始
                this.touch.initiated = true
                // touch开始的X坐标
                this.touch.startX = e.touches[0].pageX
                // touch开始的偏移量
                this.touch.left = this.$refs.progress.clientWidth
            },
            progressBtnMove(e) {
                if (!this.touch.initiated) {
                    return
                }
                // 拖动的X坐标量
                const touchMoveX = e.touches[0].pageX - this.touch.startX
                // 偏移量不能大于进度条的总宽度，不能小于0
                const offset = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, touchMoveX + this.touch.left))
                this._offsetWidth(offset)
            },
            progressBtnEnd() {
                this.touch.initiated = false
                this._triggerPercent()
            },
            _triggerPercent() {
                const percent = this.$refs.progress.clientWidth / (this.$refs.progressBar.clientWidth - progressBtnWidth)
                this.$emit('percentChange', percent)
            },
            _offsetWidth(offset) {
                this.$refs.progress.style.width = `${offset}px`
                this.$refs.progressBtn.style[transform] = `translate3d(${offset}px, 0, 0)`
            }
        },
        watch: {
            percent(newPercent) {
                if (newPercent >= 0 && !this.touch.initiated) {
                    const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
                    let progressWidth = newPercent * barWidth
                    this._offsetWidth(progressWidth)
                }
            }
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @import '~common/stylus/variable.styl'
    .progress-bar
        height: 30px
        .bar-inner
            position: relative
            top: 13px
            height: 4px
            background: rgba(0, 0, 0, 0.3)
            .progress
                position: absolute
                height: 100%
                background: $color-theme
            .progress-btn-wrapper
                position: absolute
                left: -8px
                top: -13px
                width: 30px
                height: 30px
                .progress-btn
                    position: relative
                    top: 7px
                    left: 7px
                    box-sizing: border-box
                    width: 16px
                    height: 16px
                    border: 3px solid $color-text
                    border-radius: 50%
                    background: $color-theme
</style>

