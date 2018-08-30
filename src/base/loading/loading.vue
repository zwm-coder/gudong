<template>
  <div class="loading">
    <div class="content">
      <!-- <img :src="loadimg" alt="" class="load-img"> -->
      <p class="load-text">{{loadtext}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: {
    // loadimg: {
    //   type: String,
    //   default: require('../../common/img/loading.gif')
    // },
    loadtext: {
      type: String,
      default: '加载中...'
    }
  }
}
</script>

<style lang="stylus" scoped>
.loading {
  // position: absolute;
  // top: 0;
  // right: 0;
  // left: 0;
  // bottom: 0;
  z-index: 300;

  .content {
    padding: 10px 30px;
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    text-align: center;
    border-radius: 5px;

    .load-text {
      color: #fff;
    }
  }
}
</style>
