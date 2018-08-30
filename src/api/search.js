import axios from 'axios'
import config from './config'

export function getHotSearch () {
  const url = `${config.baseUrl}/search/hot`

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSearch (name, page) {
  const url = `${config.baseUrl}/search?keywords=${name}?offset=${page}`

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}
