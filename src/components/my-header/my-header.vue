<template>
  <div class="header">
    <div class="icon menu">
      <i class="iconfont icon-menu3"></i>
    </div>
    <div class="name">咕咚咕咚</div>
    <div class="icon search">
      <router-link to="/search">
        <i class="iconfont icon-search"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'my-header'
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.header {
  display: flex;
  height: 30px;
  padding: 10px;
  line-height: 30px;
  text-align: center;
  box-shadow: 0 2px 5px $color-border;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 10;

  .icon {
    flex: 0 0 40px;

    &.search {
      a {
        text-decoration: none;
      }
    }
  }

  .name {
    flex: 1;
    font-size: $font-size-large;
  }
}
</style>
