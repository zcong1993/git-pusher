const emoji = require('emojilib')

const LENGTH = 1449
const libs = emoji.lib

const random = () => Math.floor(Math.random() * LENGTH)

module.exports = function getEmoji() {
  const emoji = libs[Object.keys(libs)[random()]].char
  if (!emoji) {
    return getEmoji()
  }
  return emoji
}
