<template>

  <div class="player" v-show="playList.length > 0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="top">
          <div class="icon" @click="closeNormal">
            <i class="iconfont icon-down"></i>
          </div>
          <div class="title">
            <h4>{{currentSong.name}}</h4>
            <p class="sub-title">{{currentSong.singer}}</p>
          </div>
          <div class="icon i-r" @click="showPlayList">
            <i class="iconfont icon-all"></i>
          </div>
        </div>
        <div class="meduim" @click="changeShowLyric">
          <div class="cd-wrapper" v-show="!showLyric">
            <div class="cd-w">
              <div class="cd" :class="{play : playing}">
                <img :src="currentSong.image" alt="">
              </div>
            </div>
            <div class="btn-w">
              <div class="btn icon-l">
                <i class="btn iconfont" :class="modeIcon" @click.stop="changePlayMode"></i>
              </div>
              <div class="btn icon-c">
                <i class="iconfont icon-like"></i>
              </div>
              <div class="btn icon-r">
                <i class="iconfont icon-comment_light"></i>
              </div>

            </div>
          </div>
          <scroll ref="lyricList" class="lyrics" v-show="showLyric" :data="currentLyric && currentLyric.lines" :scrollY="true" :scrollX="false">
            <div class="lyric-wrapper">
              <div v-if="currentLyric && currentLyric.lines">
                <p class="text" ref="lyricLine" v-for="(line, index) in currentLyric.lines" :key="index" :class="{'current': currentLineNum === index +1}">{{line.txt}}</p>
              </div>
              <div v-if="!currentLyric" class="no-lyric">
                获取歌词失败，
                <span @click.stop="getLyric">点击重试</span>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="progress-bar">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :precent="precent" @precentChange="onPregressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="controls">
            <div class="left">
              <i class="iconfont icon-backwardfill" @click="prev"></i>
            </div>
            <div class="center">
              <i class="iconfont" :class="{'icon-playfill' : !playing, 'icon-stop' : playing}" @click="togglePlaying"></i>
            </div>
            <div class="right">
              <i class="iconfont icon-play_forward_fill" @click="next"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="openNormal">
        <div class="cover-img">
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <div class="infos">
          <div class="title">
            <h4 class="name">{{currentSong.name}}</h4>
            <p class="subtitle">{{currentSong.singer}}</p>
          </div>
          <div class="progress">
            <progress-bar :precent="precent" @precentChange="onPregressBarChange"></progress-bar>
          </div>
        </div>
        <div class="controls">
          <div class="pause-btn">
            <i class="iconfont" :class="{'icon-playfill' : !playing, 'icon-stop' : playing}" @click.stop="togglePlaying"></i>
          </div>
        </div>
      </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @ended="end" @timeupdate="timeupdate"></audio>
    <transition name="slide">
      <div class="slide" v-show="showList" @click="closePlayListSlide">
        <SlideBar :show="showList">
          <div class="header"></div>
          <scroll ref="playlistsc" :scrollY="true" :scrollX="false" :data="sequenceList" style="height: 100%; overflow: hidden;">
            <div class="lists">
              <SongList :songs="sequenceList"></SongList>
            </div>
          </scroll>
        </SlideBar>
      </div>
    </transition>
  </div>

</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { playMode } from '@/utils/config'
import { shuffle } from '@/utils/index'
import { getSongDetail } from '@/api/song'
import { filterDuration } from '@/common/js/song'
import ProgressBar from '@/base/progress-bar/progress-bar'
import SlideBar from '@/base/slide-bar/slide-bar'
import Scroll from '@/base/scroll/scroll'
import SongList from '@/base/songlist/songlist'
import Lyric from 'lyric-parser'
export default {
  name: 'player',
  data () {
    return {
      currentTime: 0,
      showLyric: false,
      currentLyric: null,
      currentLineNum: 1,
      showList: false
    }
  },
  created () {

  },
  computed: {
    ...mapGetters(['playing', 'fullScreen', 'currentSong', 'playList', 'currentIndex', 'playMode', 'sequenceList']),
    precent () {
      return this.currentTime / this.currentSong.duration
    },
    modeIcon () {
      return this.playMode === playMode.sequence ? 'icon-sequence-play' : this.playMode === playMode.loop ? 'icon-single-loop' : 'icon-random-play'
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST',
      setSongDuration: 'SET_SONG_DURATION'
    }),
    closePlayListSlide () {
      this.showList = false
    },
    showPlayList () {
      this.showList = true
      this.$nextTick(() => {
        this.$refs.playlistsc.refresh()
      }, 20)
    },
    closeNormal () {
      this.setFullScreen(false)
    },
    openNormal () {
      this.setFullScreen(true)
    },
    togglePlaying () {
      this.setPlaying(!this.playing)
    },
    next () {
      this.currentLyric = null
      if ((this.currentIndex + 1) >= this.playList.length) {
        this.setCurrentIndex(0)
      } else {
        this.setCurrentIndex(this.currentIndex + 1)
      }
      this.setPlaying(true)
    },
    prev () {
      this.currentLyric = null
      if ((this.currentIndex - 1) < 0) {
        this.setCurrentIndex(0)
      } else {
        this.setCurrentIndex(this.currentIndex - 1)
      }
      this.setPlaying(true)
    },
    end () {
      this.currentLyric = null
      if (this.playMode === playMode.loop) {
        // 如果是单曲循环
        this.$refs.audio.play()
        return
      }
      this.next()
    },
    format (interval) {
      interval = interval | 0
      let minute = interval / 60 | 0
      let second = this._pad(interval % 60)

      return `${minute}:${second}`
    },
    _pad (num, n = 2) {
      let length = num.toString().length
      while (length < n) {
        num = '0' + num
        length++
      }
      return num
    },
    timeupdate (e) {
      this.currentTime = e.target.currentTime
    },
    changeShowLyric () {
      this.showLyric = !this.showLyric
      if (this.showLyric) {
        this.$refs.lyricList.refresh()
      }
    },
    getLyric () {
      this.currentSong._getSongLyric().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this.handlerLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      })
    },
    handlerLyric ({ lineNum, txt }) {
      if (this.playing) {
        lineNum = this.currentLyric.curNum
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineE = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineE, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
      }
    },
    onPregressBarChange (precent) {
      let current = precent * this.currentSong.duration
      let times = this.format(current).split(':')
      let time = times[0] * 60 * 1000 + times[1] * 1000 + (times[2] || 0) * 10
      this.$refs.audio.currentTime = current
      this.currentLyric.play(time)
    },
    changePlayMode () {
      let mode = (this.playMode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.sequence) {
        // 循序播放
        list = this.sequenceList.concat()
      } else if (mode === playMode.loop) {
        // 单曲循环
        list = new Array(this.sequenceList[this.currentIndex])
      } else {
        // 随机播放
        list = shuffle(this.sequenceList.concat())
      }

      this.resetCurrentIndex(list)
      // 改变播放列表单
      this.setPlayList(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    }
  },
  watch: {
    currentSong () {
      this.$nextTick(() => {
        if (this.currentLyric) {
          this.currentLyric = null
        }
        if (this.currentSong.duration === 0) {
          getSongDetail(this.currentSong.id).then((res) => {
            if (res.code === 200) {
              let duration = filterDuration(res.songs[0])
              this.setSongDuration({ duration, img: res.songs[0].al.picUrl })
            }
          })
        }
        this.getLyric()
        if (this.playing) {
          this.$refs.audio.play()
        }
      })
    },
    playing (newPlaying) {
      let audio = this.$refs.audio
      newPlaying ? audio.play() : audio.pause()
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    }
  },
  components: {
    ProgressBar,
    Scroll,
    SlideBar,
    SongList
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

@keyframes cdRotate {
  from {
    transform: rotateZ(0deg);
  }

  to {
    transform: rotateZ(360deg);
  }
}

@keyframes cdRotate {
  from {
    --webkit-transform: rotateZ(0deg);
  }

  to {
    --webkit-transform: rotateZ(360deg);
  }
}

@keyframes cdRotate {
  from {
    --moz-transform: rotateZ(0deg);
  }

  to {
    --moz-transform: rotateZ(360deg);
  }
}

.normal-enter-active, .normal-leave-active {
  transition: all 0.3s ease;
}

.normal-enter, .normal-leave-to {
  transform: translateY(100%);
}

.mini-enter-active, .mini-leave-active {
  transition: all 0.3s ease;
}

.mini-enter, .mini-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter {
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(100%);
}

.player {
  .normal-player {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background: #fff;

    .top {
      display: flex;
      padding: 10px 20px;
      box-sizing: border-box;

      .icon {
        flex: 0 0 40px;

        &.i-r {
          text-align: right;
        }

        .iconfont {
          font-size: $font-size-large-x;
          line-height: 37px;
        }
      }

      .title {
        flex: 1;
        text-align: center;

        // position: relative;
        // left: -20px;
        .sub-title {
          font-size: $font-size-small;
          color: $color-text-ll;
        }
      }
    }

    .meduim {
      position: absolute;
      top: 57px;
      left: 0;
      right: 0;
      bottom: 172px;
      padding: 20px;
      box-sizing: border-box;
      overflow: hidden;

      .cd-wrapper {
        width: 100%;
        height: 100%;
        padding: 0 20px;
        box-sizing: border-box;

        .cd-w {
          width: 100%;
          padding-bottom: 100%;
          background: $color-text;
          box-sizing: border-box;
          position: relative;
          border-radius: 75%;

          .cd {
            position: absolute;
            top: 15%;
            left: 15%;
            right: 15%;
            bottom: 15%;
            overflow: hidden;
            border-radius: 75%;
            border: 20px solid #000;
            background: red;

            &.play {
              animation: cdRotate 20s linear infinite;
            }

            img {
              width: 100%;
              height: 100%;
            }
          }
        }

        .btn-w {
          display: flex;
          margin-top: 40px;

          .btn {
            flex: 1;
            text-align: center;

            .iconfont {
              font-size: $font-size-large-xx;
              color: $color-text-ll;
            }
          }
        }
      }

      .lyrics {
        width: 100%;
        height: 100%;
        overflow: hidden;
        text-align: center;

        .text {
          padding: 5px 0;

          &.current {
            color: $color-theme;
          }
        }

        .no-lyric {
          margin-top: 60px;

          span {
            color: $color-theme;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px;

      .progress-bar {
        display: flex;
        algin-items: center;
        margin: 0 auto;
        padding: 10px 0;

        .time {
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 50px;
          width: 30px;
          padding: 0 2px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .controls {
        display: flex;
        padding: 30px 20px 40px 20px;
        align-items: center;

        .iconfont {
          font-size: $font-size-large-xx;
          color: $color-theme;
        }

        .left {
          flex: 0 0 60px;
          text-align: right;
        }

        .center {
          flex: 1;
          text-align: center;

          .iconfont {
            padding: 15px;
            border-radius: 60px;
            box-shadow: 0 2px 6px $color-text-ll;
          }
        }

        .right {
          flex: 0 0 60px;
          text-align: left;
        }
      }
    }
  }

  .mini-player {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 80px;
    z-index: 99;
    background: #fff;
    display: flex;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0 -1px 1px $color-border-l;
    align-items: center;

    .cover-img {
      flex: 0 0 60px;
      height: 60px;
      overflow: hidden;
    }

    .infos {
      flex: 1;
      padding-left: 20px;

      // overflow: hidden;
      .title {
        .subtitle {
          padding-top: 5px;
        }
      }
    }

    .controls {
      flex: 0 0 40px;
      padding-left: 10px;

      .pause-btn {
        .iconfont {
          padding: 10px;
          border-radius: 36px;
          box-shadow: 0 2px 6px $color-text-ll;
          font-size: $font-size-large-x;
          color: $color-theme;
        }
      }
    }
  }

  .slide {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.4);
    z-index: 220;
  }
}
</style>
