import { playMode } from '../utils/config'

const state = {
  playing: false, // 播放中
  fullScreen: true, // 全屏播放器
  playList: [], // 播放列表
  sequenceList: [], // 顺序列表
  playMode: playMode.sequence, // 播放模式
  currentIndex: 0 // 当前歌曲下标
}

export default state
