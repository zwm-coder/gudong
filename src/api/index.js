import axios from 'axios'
import config from './config'

// 获取Banner数据
export function getBanner () {
  const url = `${config.baseUrl}/banner`
  return axios.get(url)
    .then((res) => {
      return Promise.resolve(res)
    })
}

// 获取推荐新音乐列表
export function getNewSong () {
  const url = `${config.baseUrl}/personalized/newsong`
  return axios.get(url)
    .then((res) => {
      return Promise.resolve(res)
    })
}

// 获取推荐歌单
export function getRecommendSongMenu () {
  const url = `${config.baseUrl}/personalized`
  return axios.get(url)
    .then((res) => {
      return Promise.resolve(res)
    })
}
