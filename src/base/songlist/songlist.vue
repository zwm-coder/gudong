<template>
  <div class="songlist" v-if="songs && songs.length > 0">
    <ul>
      <li class="item" v-for="(item, index) in songs" :key="index" @click="selectItem(item, index)">
        <div class="left">
          <p>{{index + 1}}</p>
        </div>
        <div class="center">
          <h4 class="name">{{item.name}}</h4>
          <p class="singer">{{item.singer}} - {{item.album}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'songlist',
  props: {
    songs: {
      type: Array
    }
  },
  methods: {
    ...mapActions(['selectPlay']),
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.songlist {
  ul {
    list-style: none;
    padding-left: 0;

    .item {
      padding: 10px 0;
      display: flex;
      align-items: center;

      .left {
        flex: 0 0 60px;
        text-align: center;
      }

      .center {
        flex: 1;
        padding-left: 10px;

        .singer {
          padding-top: 4px;
          color: $color-text-ll;
          font-size: $font-size-small;
        }
      }
    }
  }
}
</style>
