<template>
  <transition name="fade">
    <div class="playlist-detail">
      <top-menu title="歌单详情" bg="#2ddae8"></top-menu>
      <scroll class="sc-content" :scrollX="false" :scrollY="true" :style="{'height': fullHeight - 50 + 'px'}" v-if="songs.length > 0">
        <div class="content">
          <div class="info">
            <div class="cover-img">
              <img :src="coverImgUrl" alt="">
            </div>
            <div class="text">
              <h4 class="title">{{name}}</h4>
              <div class="creator">收集: {{nickname}}</div>
              <div class="desc">简介: {{description}}</div>
            </div>
          </div>
          <div class="play-btn" @click="selectItem">
            <i class="iconfont icon-video"></i>
            <p>全部播放(共{{trackCount}}首)</p>
          </div>
          <div class="lists">
            <song-list :songs="songs"></song-list>
          </div>
        </div>
      </scroll>
      <Loading v-if="songs.length === 0"></Loading>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'
import { getPlayListDetail } from '@/api/playlist'
import config from '@/api/config'
import { changePlayCount } from '@/utils/index'

import { createSong } from '@/common/js/song'

import TopMenu from '@/base/top-menu/top-menu'
import SongList from '@/base/songlist/songlist'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
export default {
  name: 'playlist-detail',
  data () {
    return {
      songs: [],
      fullHeight: document.documentElement.clientHeight,
      nickname: '',
      coverImgUrl: '',
      name: '',
      description: '',
      trackCount: 0
    }
  },
  created () {
    this._getPlayListDetail()
  },
  methods: {
    ...mapActions(['selectPlay']),
    selectItem (item) {
      this.selectPlay({
        list: this.songs,
        index: 0
      })
    },
    _getParam () {
      return this.$route.query.id
    },
    _getPlayListDetail () {
      let id = this._getParam()
      getPlayListDetail(id).then((res) => {
        if (res.data.code === config.code_ok) {
          this.songs = this._normalSongList(res.data.playlist.tracks)
          this.nickname = res.data.playlist.creator.nickname
          this.coverImgUrl = res.data.playlist.coverImgUrl
          this.name = res.data.playlist.name
          this.description = res.data.playlist.description
          this.trackCount = res.data.playlist.trackCount
        }
      })
    },
    _changePlayCount (count) {
      return changePlayCount(count)
    },
    _normalSongList (list) {
      let ret = []
      list.forEach((element) => {
        ret.push(createSong(element))
      })
      return ret
    }
  },
  components: {
    TopMenu,
    SongList,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
// @import '~@/common/stylus/variable.styl';
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter {
  transform: translateX(100%);
  opacity: 1;
}

.fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.playlist-detail {
  position: absolute;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  background: #ffffff;
  z-index: 50;

  .sc-content {
    margin-top: 50px;
    overflow: hidden;
  }

  .content {
    width: 100%;

    .info {
      display: flex;
      padding: 20px;
      background: $color-theme;
      align-items: center;

      .cover-img {
        flex: 0 0 100px;

        img {
          width: 100%;
          border-radius: 5px;
        }
      }

      .text {
        flex: 1;
        padding-left: 16px;

        .title {
          margin-bottom: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }

        .creator {
          padding-bottom: 10px;
        }

        .desc {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
      }
    }

    .play-btn {
      padding: 10px 20px 10px 20px;
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid $color-border-ll;

      .iconfont {
        font-size: $font-size-large-xx;
        margin-top: 3px;
      }

      p {
        display: inline-block;
        vertical-align: top;
      }
    }
  }
}
</style>
