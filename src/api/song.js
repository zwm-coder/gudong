import axios from 'axios'
import config from './config'

export function getSongUrl (id) {
  const url = `${config.baseUrl}/music/url?id=${id}`

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongLyric (id) {
  const url = `${config.baseUrl}/lyric?id=${id}`

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongDetail (id) {
  const url = `${config.baseUrl}/song/detail?ids=${id}`

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}
