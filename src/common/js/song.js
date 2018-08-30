import { getSongLyric } from '@/api/song'
import config from '@/api/config'

// 歌曲类
export default class Song {
  constructor ({ id, name, singer, album, duration, image, url }) {
    this.id = id
    this.name = name
    this.singer = singer
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  _getSongLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getSongLyric(this.id).then((res) => {
        if (res.code === config.code_ok) {
          this.lyric = res.lrc.lyric
          resolve(this.lyric)
        } else {
          reject(res)
        }
      })
    })
  }

  _setDuration (duration) {
    this.duration = duration
  }

  _setImage (img) {
    this.image = img
  }
}

export function createSong (songData) {
  return new Song({
    id: songData.id,
    name: songData.name,
    singer: filterSinger(songData.ar),
    album: songData.al.name,
    duration: filterDuration(songData),
    image: songData.al.picUrl,
    url: `http://music.163.com/song/media/outer/url?id=${songData.id}.mp3`
  })
}

function filterSinger (singers) {
  let ret = []
  if (!singers) {
    return
  }
  for (let i = 0; i < singers.length; i++) {
    if (i > 2) {
      ret.push('...')
      break
    }
    ret.push(singers[i].name)
  }
  return ret.join('/')
}

export function filterDuration (songData) {
  let size = 0
  let br = 0
  if (songData.m) {
    size = songData.m.size
    br = songData.m.br
  } else if (songData.l) {
    size = songData.l.size
    br = songData.l.br
  } else {
    return 0
  }
  return size * 8 / br
}
