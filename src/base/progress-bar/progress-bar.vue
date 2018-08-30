<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend.prevent="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 10
export default {
  name: 'progress-bar',
  props: {
    precent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    precent (newPrecent) {
      if (newPrecent >= 0 && !this.touch.initiated) {
        let barWidth = this.$refs.progressBar.clientWidth
        let offsetWidth = newPrecent * barWidth
        this._offset(offsetWidth)
      }
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.changedTouches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.changedTouches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd (e) {
      this.touch.initiated = false
      this.triggerPrecent()
    },
    triggerPrecent () {
      let barWidth = this.$refs.progressBar.clientWidth
      const precent = this.$refs.progress.clientWidth / barWidth
      this.$emit('precentChange', precent)
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style.left = `${offsetWidth - progressBtnWidth}px`
    },
    progressClick (e) {
      this._offset(e.offsetX)
      this.triggerPrecent()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    border-radius: 3px;
    background: $color-border-l;
    width: 100%;

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
      border-radius: 3px;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 10px;
        left: 5px;
        box-sizing: border-box;
        width: 10px;
        height: 10px;
        border: 3px solid $color-theme;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
