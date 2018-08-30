<template>
  <div class="top-menu" :style="{'background-color': bg}">
    <div class="icon back">
      <i class="iconfont icon-left" @click="goBack"></i>
    </div>
    <div class="text">
      <p>{{title}}</p>
    </div>
    <div class="icon share">
      <i class="iconfont icon-share"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'top-menu',
  props: {
    title: {
      type: String,
      default: ''
    },
    bg: {
      type: String,
      default: '#fff'
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.top-menu {
  position: fixed;
  top: 0px;
  left: 0;
  right: 0;
  height: 50px;
  box-sizing: border-box;
  padding: 10px 20px;
  display: flex;
  z-index: 10;

  .icon {
    flex: 0 0 30px;
    line-height: 30px;

    .iconfont {
      font-size: $font-size-large;
    }

    &.back {
      text-align: left;
    }

    &.share {
      text-align: right;
    }
  }

  .text {
    flex: 1;
    text-align: center;
    line-height: 30px;
  }
}
</style>
