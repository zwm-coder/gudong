<template>
  <div id="app">
    <!-- <keep-alive> -->
    <router-view></router-view>
    <!-- </keep-alive> -->
    <player></player>
  </div>
</template>

<script>
import Index from '@/components/index/index'
import Player from '@/components/player/player'
export default {
  name: 'App',
  components: {
    Index,
    Player
  }
}
</script>

<style lang="stylus">
html, body {
  margin: 0;
  padding: 0;
}

h1, h2, h3, h4, h5, h6, p {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
