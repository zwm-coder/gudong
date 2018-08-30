<template>
  <transition name="fade">
    <div class="search">
      <div class="header">
        <div class="back" @click="goBack">
          <i class="iconfont icon-back"></i>
        </div>
        <div class="form">
          <input type="text" class="search-input" placeholder="想听啥呢" v-model="searchName">
        </div>
        <div class="btn" @click="_getSearch">
          <p>搜索</p>
        </div>
      </div>
      <div class="search-type" @click="_showSearchType">
        <p>点击选择搜索源： {{typeNames[searchType]}}</p>
      </div>

      <transition name="slide">
        <div class="search-type-slide" v-show="showSearchType" @click="_closeSearchType">
          <slide-bar :show="showSearchType">
            <ul>
              <li @click.stop="selectType(0)">
                <i class="iconfont icon-wangyiyun"></i>网易云音乐 (默认)</li>
              <li @click.stop="selectType(1)">
                <i class="iconfont icon-qqmusic"></i>QQ音乐</li>
              <li @click.stop="selectType(2)">
                <i class="iconfont icon-xiami"></i>虾米音乐</li>
              <li @click.stop="selectType(3)">
                <i class="iconfont icon-kugou"></i>酷狗</li>
              <li @click.stop="selectType(4)">
                <i class="iconfont icon-kuwo"></i>酷我</li>
              <li @click.stop="selectType(5)">
                <i class="iconfont icon-baidu"></i>百度音乐</li>
              <li @click.stop="selectType(6)">
                <i class="iconfont icon-migu"></i>咪咕音乐</li>
            </ul>
          </slide-bar>
        </div>
      </transition>

      <div class="hot-search" v-if="songs.length === 0">
        <p class="title">热门搜索</p>
        <div class="lists">
          <span class="hot-name" v-for="(item, index) in hotSearch" :key="index" @click="selectHotSearchName(item.first)">
            {{item.first}}
          </span>
        </div>
      </div>
      <div class="result" v-if="songs.length > 0">
        <scroll :scrollY="true" :scrollX="false" :data="songs" class="lists" :style="{'height': fullHeight + 'px'}">
          <ul>
            <li v-for="(item, index) in songs" :key="index" @click="_selectItem(index)">
              <h4 class="name">{{item.name}}</h4>
              <p class="info">
                <span class="singer">{{item.singer}} - </span>
                <span class="album">{{item.album}}</span>
              </p>
            </li>
          </ul>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SlideBar from '@/base/slide-bar/slide-bar'
import Scroll from '@/base/scroll/scroll'
import { getHotSearch, getSearch } from '@/api/search'
import Song from '@/common/js/song'
export default {
  name: 'search',
  data () {
    return {
      showSearchType: false,
      typeNames: ['网易云', 'QQ音乐', '虾米', '酷狗', '酷我', '百度', '咪咕'],
      searchType: 0,
      hotSearch: [],
      searchName: '',
      songs: []
      // fullHeight: document.documentElement.clientHeight
    }
  },
  created () {
    this._getHotSearch()
  },
  computed: {
    ...mapGetters(['playList', 'fullScreen']),
    fullHeight () {
      if (this.playList.length > 0 && !this.fullScreen) {
        return document.documentElement.clientHeight - 172
      }
      return document.documentElement.clientHeight - 92
    }
  },
  components: {
    SlideBar,
    Scroll
  },
  methods: {
    ...mapActions(['selectPlay']),
    _showSearchType () {
      this.showSearchType = true
    },
    _closeSearchType () {
      this.showSearchType = false
    },
    _getHotSearch () {
      getHotSearch().then((res) => {
        if (res.code === 200) {
          this.hotSearch = res.result.hots
        }
      })
    },
    _getSearch () {
      getSearch(this.searchName, 0).then((res) => {
        if (res.code === 200) {
          this.result = res.result.songs
          let lists = []
          let songs = res.result.songs

          songs.forEach((ele) => {
            let song = new Song({
              id: ele.id,
              name: ele.name,
              singer: ele.artists[0].name,
              album: ele.album.name,
              duration: 0,
              image: '',
              url: `http://music.163.com/song/media/outer/url?id=${ele.id}.mp3`
            })
            lists.push(song)
          })
          this.songs = lists
        }
      })
    },
    _selectItem (index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    selectType (num) {
      this.searchType = num
      this.showSearchType = false
    },
    goBack () {
      this.$router.go(-1)
    },
    selectHotSearchName (name) {
      this.searchName = name
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter {
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(100%);
}

.search {
  .header {
    height: 50px;
    display: flex;
    padding: 0 10px;
    background: $color-theme;
    position: fixed;
    top: 0px;
    left: 0;
    right: 0;

    .back {
      flex: 0 0 40px;
      padding: 10px 10px 10px 0;
      text-align: center;

      .iconfont {
        font-size: $font-size-large-xx;
        color: #fff;
      }
    }

    .form {
      flex: 1;

      .search-input {
        width: 100%;
        border: none;
        border-bottom: 1px solid $color-border-l;
        outline-style: none;
        height: 40px;
        box-sizing: border-box;
        background: transparent;
        padding-top: 5px;
        margin-right: 10px;
      }
    }

    .btn {
      flex: 0 0 40px;
      line-height: 50px;
      text-align: right;
    }
  }

  .search-type {
    text-align: center;
    padding: 10px 0;
    border-bottom: 1px solid $color-border-lll;
    margin-top: 50px;
  }

  .search-type-slide {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.4);
    z-index: 220;

    ul {
      list-style: none;
      padding: 0 40px;

      li {
        padding: 10px 0;
        border-bottom: 1px solid $color-border-ll;

        .iconfont {
          padding-right: 20px;
        }
      }
    }
  }

  .hot-search {
    padding: 20px 10px;

    .title {
      font-size: $font-size-small;
      color: $color-text-ll;
    }

    .lists {
      padding: 10px 0;

      .hot-name {
        display: inline-block;
        padding: 5px 10px;
        border: 1px solid $color-border-l;
        margin-right: 10px;
        margin-bottom: 10px;
        border-radius: 30px;
      }
    }
  }

  .result {
    .lists {
      overflow: hidden;

      ul {
        list-style: none;
        padding-left: 0;

        li {
          padding: 10px;
          border-bottom: 1px solid $color-border-ll;

          .info {
            padding: 5px 0;

            span {
              font-size: $font-size-small;
              color: $color-text-ll;
            }
          }
        }
      }
    }
  }
}
</style>
