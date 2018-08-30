<template>
  <div>
    <my-header></my-header>
    <scroll :data="recommendSongMenu" style="width: 100%; overflow: hidden;" :style="{'height': fullHeight + 'px'}" :scrollX="false" :scrollY="true">
      <div class="index">
        <div class="slider">
          <carousel v-if="banners.length > 0" :datas="banners"></carousel>
        </div>
        <div class="menus">
          <div class="menu menu-fm">
            <p class="icon">
              <i class="iconfont icon-fm"></i>
            </p>
            <p class="text">私人FM</p>
          </div>
          <div class="menu menu-recommend">
            <p class="icon">
              <i class="iconfont icon-recommend"></i>
            </p>
            <p class="text">每日推荐</p>
          </div>
          <router-link to="/playlist" class="menu menu-song-menu">
            <p class="icon">
              <i class="iconfont icon-song-menu"></i>
            </p>
            <p class="text">歌单列表</p>
          </router-link>
          <div class="menu menu-rank">
            <p class="icon">
              <i class="iconfont icon-rank"></i>
            </p>
            <p class="text">排行榜单</p>
          </div>
        </div>
        <div class="content">
          <div class="new-song">
            <h3 class="a-title">最新音乐</h3>
            <scroll :data="newSong" style="width: 100%; overflow: hidden;" v-if="newSong.length > 0" :click="false">
              <div class="new-song-wrapper">
                <div class="item" v-for="(item, index) in newSong" :key="index" @click.stop="selectPlayItem(item)">
                  <div class="img">
                    <img class="cover-img" :src="item.song.album.picUrl" alt="">
                  </div>
                  <p class="title text">{{item.name}}</p>
                  <p class="star-name text">{{item.song.artists[0].name}}</p>
                </div>
              </div>
            </scroll>
          </div>
          <div class="recommend-song-mneu">
            <h3 class="a-title">推荐歌单</h3>
            <div class="wrapper">
              <div @click="selectItem(item.id)" class="item" v-for="(item, index) in recommendSongMenu" :key="index">
                <img v-lazy="item.picUrl" alt="" class="cover-img">
                <div class="name">{{item.name}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getBanner, getNewSong, getRecommendSongMenu } from '@/api/index'
import config from '@/api/config'
import Song from '@/common/js/song'

import MyHeader from '@/components/my-header/my-header'
import Carousel from '@/base/carousel/carousel'
import Scroll from '@/base/scroll/scroll'

export default {
  name: 'index',
  data () {
    return {
      banners: [],
      newSong: [],
      recommendSongMenu: [],
      fullHeight: document.documentElement.clientHeight
    }
  },
  created () {
    this._getBanner()
    this._getNewSong()
    this._getRecommendSongMenu()
  },
  methods: {
    ...mapActions(['selectPlay']),
    _getBanner () {
      getBanner().then((res) => {
        if (res.data.code === config.code_ok) {
          this.banners = res.data.banners
        }
      })
    },
    _getNewSong () {
      getNewSong().then((res) => {
        if (res.data.code === config.code_ok) {
          this.newSong = res.data.result
        }
      })
    },
    _getRecommendSongMenu () {
      getRecommendSongMenu().then((res) => {
        if (res.data.code === config.code_ok) {
          this.recommendSongMenu = res.data.result
        }
      })
    },
    selectItem (id) {
      this.$router.push({
        path: `/playlist-detail?id=${id}`
      })
    },
    selectPlayItem (item) {
      let song = new Song({
        id: item.id,
        name: item.name,
        singer: item.song.artists[0].name,
        album: item.song.album.name,
        duration: 0,
        image: item.song.album.picUrl,
        url: `http://music.163.com/song/media/outer/url?id=${item.id}.mp3`
      })
      this.selectPlay({
        list: new Array(song),
        index: 0
      })
    }
  },
  components: {
    MyHeader,
    Carousel,
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.index {
  width: 100%;
  overflow: hidden;

  .slider {
    width: 100%;
    margin-top: 50px;
    overflow: hidden;
  }

  .menus {
    display: flex;
    text-align: center;
    padding: 20px;
    border-bottom: 15px solid $color-border-ll;

    .menu {
      flex: 1;
      text-decoration: none;

      p.text {
        padding-top: 8px;
        font-size: $font-size-small;
        color: $color-text;
      }

      .iconfont {
        font-size: $font-size-large-xx;
        color: $color-theme;
      }
    }
  }

  .content {
    padding: 10px 0;
    width: 100%;
    box-sizing: border-box;

    .new-song {
      border-bottom: 15px solid $color-border-ll;
      padding: 0 10px;

      .new-song-wrapper {
        padding: 10px 0;
        white-space: nowrap;
        overflow: hidden;
        display: inline-block;

        .item {
          display: inline-block;
          margin-right: 15px;

          .cover-img {
            width: 120px;
          }

          .text {
            width: 120px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }

          .star-name {
            font-size: $font-size-small;
            color: $color-text-ll;
          }
        }
      }
    }

    .recommend-song-mneu {
      padding: 10px;
      width: 100%;
      box-sizing: border-box;

      .wrapper {
        display: flex;
        padding: 10px 0;
        flex-wrap: wrap;
        justify-content: space-between;

        .item {
          flex: 0 0 32%;
          max-width: 32%;
          margin-bottom: 15px;

          .cover-img {
            width: 100%;
          }

          .name {
            display: -webkit-box;
            text-overflow: ellipsis;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: $font-size-small;
          }
        }
      }
    }
  }
}
</style>
