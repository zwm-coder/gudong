<template>
  <transition name="fade">
    <div class="playlist">
      <top-menu title="歌单" bg="#2ddae8"></top-menu>
      <scroll ref="scroll" v-if="playlists.length > 0" :data="playlists" :scrollY="true" :pullUpLoad="pullUpLoadObj" @pullingUp="onPullingUp" :style="{'height': fullHeight + 'px', 'overflow': 'hidden', 'margin': '50px 0'}">
        <div class="content">
          <!-- <div class="category">
          <p>全部歌单
            <i class="iconfont icon-right"></i>
          </p>
        </div> -->
          <div class="lists">
            <ul>
              <li class="item" v-for="(item, index) in playlists" :key="index" @click="selectItem(item.id)">
                <div class="cover-img">
                  <img :src="item.coverImgUrl" alt="">
                </div>
                <div class="text">
                  <h4 class="name">{{item.name}}</h4>
                  <p class="desc" v-if="item.description">{{item.description}}</p>
                  <p class="desc" v-if="!item.description">暂无歌单简介</p>
                  <div class="creator">
                    <span class="name">{{item.creator.nickname}}</span>
                    <span class="avatar">
                      <img :src="item.creator.avatarUrl" alt="" width="30" height="30">
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="more" v-if="more">
            <p @click="onPullingUp">{{pullUpLoadMoreTxt}}</p>
          </div>
          <div class="more" v-if="!more">
            <p>{{pullUpLoadMoreTxt}}</p>
          </div>
        </div>
      </scroll>
      <loading v-if="playlists.length === 0"></loading>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import TopMenu from '@/base/top-menu/top-menu'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'

import { getPlayList } from '@/api/playlist'
export default {
  name: 'playlist',
  components: {
    TopMenu,
    Scroll,
    Loading
  },
  data () {
    return {
      cat: '',
      offset: 0,
      more: false,
      playlists: [],
      pullUpLoad: true,
      pullUpLoadThreshold: 0,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '无更多数据'
    }
  },
  created () {
    this._getPlayList()
  },
  computed: {
    ...mapGetters(['playList', 'fullScreen']),
    fullHeight () {
      if (this.playList.length > 0 && !this.fullScreen) {
        return document.documentElement.clientHeight - 130
      }
      return document.documentElement.clientHeight
    },
    pullUpLoadObj: function () {
      return this.pullUpLoad ? {
        threshold: parseInt(this.pullUpLoadThreshold),
        txt: { more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt }
      } : false
    }
  },
  methods: {
    _getPlayList () {
      getPlayList(this.cat, this.offset).then((res) => {
        if (res.code === 200) {
          this.playlists = this.playlists.concat(res.playlists)
          if (res.more) {
            this.more = true
          }
        }
      }).catch((e) => {
        this.pullUpLoadMoreTxt = '加载失败'
      })
    },
    selectItem (id) {
      this.$router.push({
        path: `/playlist-detail?id=${id}`
      })
    },
    onPullingUp () {
      if (this.more) {
        this.pullUpLoadMoreTxt = '加载中...'
        this.offset += 20
        this.more = false
        this._getPlayList()
        this.pullUpLoadMoreTxt = '加载更多'
      }
    }
  },
  watch: {
    pullUpLoadObj: {
      handler (val) {
        const scroll = this.$refs.scroll.scroll
        if (val) {
          scroll.openPullUp()
        } else {
          scroll.closePullUp()
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

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

.content {
  margin-top: 50px;

  .category {
    padding: 10px;
    border-bottom: 1px solid $color-border-lll;

    p {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 50px;
      border: 1px solid $color-border-l;
    }
  }

  .lists {
    ul {
      list-style: none;
      padding-left: 0;
      padding: 0 10px;

      .item {
        display: flex;
        padding: 10px 0;
        border-bottom: 1px solid $color-border-ll;
        align-items: top;

        .cover-img {
          flex: 0 0 110px;

          img {
            width: 100%;
          }
        }

        .text {
          flex: 1;
          padding: 0 20px;
          position: relative;

          .name {
            padding-bottom: 5px;
          }

          .desc {
            color: $color-text-ll;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            margin-bottom: 50px;
          }

          .creator {
            position: absolute;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;

            .name {
              display: inline-block;
              font-size: $font-size-small;
              padding-bottom: 0px;
              padding-right: 5px;
            }

            .avatar {
              display: inline-block;

              img {
                border-radius: 30px;
              }
            }
          }
        }
      }
    }
  }

  .more {
    text-align: center;
  }
}
</style>
