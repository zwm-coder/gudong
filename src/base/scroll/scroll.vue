<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    scrollX: {
      type: Boolean,
      default: true
    },
    scrollY: {
      type: Boolean,
      default: false
    },
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    top: {
      type: Boolean,
      default: true
    },
    right: {
      type: Boolean,
      default: true
    },
    bottom: {
      type: Boolean,
      default: true
    },
    left: {
      type: Boolean,
      default: true
    },
    pullUpLoad: {
      type: null,
      default: true
    },
    startY: {
      type: Number,
      default: 0
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX,
        scrollY: this.scrollY,
        bounce: {
          top: this.top,
          right: this.right,
          bottom: this.bottom,
          left: this.left
        },
        pullUpLoad: this.pullUpLoad,
        startY: this.startY
      })
      if (this.pullUpLoad) {
        this._initPullUpLoad()
      }
    },
    _initPullUpLoad () {
      this.scroll.on('pullingUp', () => {
        // this.isPullUpLoad = true
        this.$emit('pullingUp')
      })
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    pullingUp () {
      this.scroll && this.scroll.pullingUp()
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
