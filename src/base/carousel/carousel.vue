<template>
  <div class="carousel-container" ref="carousel">
    <ul class="lists" ref="carouselList">
      <li ref="carouselItem" class="item" v-for="(item, index) in datas" :key="index" @touchstart="_touchStart" @touchend="_touchEnd">
        <img :src="item.picUrl" alt="">
      </li>
    </ul>
    <div class="dots" v-show="showDots">
      <span class="dot" :class="{'current' : currentIndex === index + 1}" v-for="(item, index) in datas" :key="index" @click="setActiveItem(index + 1)"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'carousel',
  props: {
    initialIndex: {
      type: Number,
      default: 0
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    },
    showDots: {
      type: Boolean,
      default: true
    },
    datas: Array
  },
  data () {
    return {
      currentIndex: 1
    }
  },
  mounted () {
    this._initWidth()
    if (this.autoPlay) {
      this.play()
    }
  },
  methods: {
    _initWidth () {
      this.carousel = this.$refs.carousel
      this.clientWidth = this.carousel.clientWidth
      this.$refs.carouselList.style.width = `${this.clientWidth * (this.datas.length + 2)}px`
      this.sliders = this.$refs.carouselItem
      for (let i = 0; i < this.sliders.length; i++) {
        this.sliders[i].style.width = this.clientWidth + 'px'
      }

      // 前后各添加一张图片以实现无限滚动
      let sliderFirst = this.sliders[0]
      let sliderLast = this.sliders[this.sliders.length - 1]
      this.carouselList = this.$refs.carouselList
      this.carouselList.appendChild(sliderFirst.cloneNode(true))
      this.carouselList.insertBefore(sliderLast.cloneNode(true), sliderFirst)

      // 使其显示“第一张图片”
      this.carouselList.style.transitionProperty = 'none' // 避免因过渡时长带来的回拉效果
      this.carouselList.style.left = -this.clientWidth + 'px'

      // 由于子元素是绝对定位，脱离文档流，所以无法撑开父元素的高度，此处初始化父元素的高度
      this.carousel.style.height = this.carouselList.clientHeight + 'px'
    },
    play () {
      this.timer = setTimeout(this.next, this.interval)
    },
    next () {
      this.currentIndex += 1
      this.carouselList.style.left = -(this.currentIndex * this.clientWidth) + 'px'

      if (this.currentIndex === (this.datas.length + 1)) {
        this.currentIndex = 1

        setTimeout(() => {
          this.carouselList.style.transitionProperty = 'none'
          this.carouselList.style.left = -this.clientWidth + 'px'
        }, 500)
      } else {
        this.carouselList.style.transitionProperty = 'left'
      }

      clearTimeout(this.timer)
      this.play()
    },
    prev () {
      this.currentIndex -= 1
      this.carouselList.style.left = -(this.currentIndex * this.clientWidth) + 'px'

      if (this.currentIndex === 0) {
        this.currentIndex = this.datas.length
        setTimeout(() => {
          this.carouselList.style.transitionProperty = 'none'
          this.carouselList.style.left = -(this.currentIndex * this.clientWidth) + 'px'
        }, 500)
      } else {
        this.carouselList.style.transitionProperty = 'left'
      }

      clearTimeout(this.timer)
      this.play()
    },
    setActiveItem (index) {
      clearTimeout(this.timer)
      this.currentIndex = index
      this.carouselList.style.left = -(this.currentIndex * this.clientWidth) + 'px'
      this.play()
    },
    _touchStart (e) {
      this.startX = e.touches[0].pageX
    },
    _touchEnd (e) {
      let endX = e.changedTouches[0].pageX
      let dx = endX - this.startX
      if (dx >= 2) {
        this.prev()
      } else if (dx < 0) {
        // 向右滑动
        this.next()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.carousel-container {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  position: relative;

  .lists {
    list-style: none;
    padding-left: 0;
    overflow: auto;
    margin: 0;
    position: absolute;
    left: 0;
    transition: left 0.5s;

    .item {
      float: left;

      img {
        width: 100%;
        float: left;
      }
    }
  }

  .dots {
    position: absolute;
    width: 100%;
    height: 20px;
    bottom: 10px;
    text-align: center;

    .dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin: 0 5px;
      border-radius: 10px;
      background: $color-border-ll;
      transition: width 0.3s;

      &.current {
        width: 20px;
        background: $color-theme;
      }
    }
  }
}
</style>
