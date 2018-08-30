import axios from 'axios'
import config from './config'

export function getPlayListDetail (id) {
  const url = `${config.baseUrl}/playlist/detail?id=${id}`
  return axios.get(url)
    .then((res) => {
      return Promise.resolve(res)
    })
}

export function getPlayList (cat, page) {
  const url = `${config.baseUrl}/top/playlist?limit=20&order=new&offset=${page}&cat=${cat}`
  return axios.get(url)
    .then((res) => {
      return Promise.resolve(res.data)
    })
}
