<template>
  <transition v-bind:name="direction">
    <div class="slide-bar" v-show="showslide">
      <div class="content-wrapper" :class="directionClass">
        <slot></slot>
      </div>
    </div>
  </transition>

</template>

<script>
export default {
  name: 'slide-bar',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'slide-bottom'
    }
  },
  data () {
    return {
      showslide: this.show
    }
  },
  computed: {
    directionClass () {
      if (this.direction === 'slide-bottom') {
        return 'vertical-bottom'
      } else if (this.direction === 'slide-top') {
        return 'vertical-top'
      } else if (this.direction === 'slide-right') {
        return 'horizontal-right'
      } else {
        return 'horizontal-left'
      }
    }
  },
  watch: {
    show () {
      this.showslide = this.show
    }
  }
}
</script>

<style lang="stylus" scoped>
.slide-bottom-enter-active, .slide-bottom-leave-active, .slide-top-enter-active, .slide-top-leave-active, .slide-left-enter-active, .slide-left-leave-active, .slide-right-enter-active, .slide-right-leave-active {
  transition: all 0.4s ease;
}

.slide-bottom-enter, .slide-bottom-leave-to {
  transform: translateY(100%);
}

.slide-top-enter, .slide-top-leave-to {
  transform: translateY(-100%);
}

.slide-left-enter, .slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter, .slide-right-leave-to {
  transform: translateX(100%);
}

.slide-bar {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 250;

  .content-wrapper {
    background: #fff;

    &.vertical-bottom {
      width: 100%;
      height: 50%;
      // min-height: 40px;
      position: absolute;
      bottom: 0;
    }

    &.vertical-top {
      width: 100%;
      height: 50%;
      // min-height: 40px;
      position: absolute;
      top: 0;
    }

    &.horizontal-left {
      width: 60%;
      height: 100%;
      position: absolute;
      left: 0;
    }

    &.horizontal-right {
      width: 60%;
      height: 100%;
      position: absolute;
      right: 0;
    }
  }
}
</style>
