export function changePlayCount (playCount) {
  let count = playCount + '' // 转换成字符串
  // console.log(count)
  let strLength = count.length
  if (strLength <= 4) {
    return count
  } else if (strLength < 9) {
    return count.substring(0, strLength - 4) + '万'
  } else {
    return count.substring(0, strLength - 8) + '亿'
  }
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) {
  for (let i = 0; i < arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
  }
  return arr
}
