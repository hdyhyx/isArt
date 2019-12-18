const {
  Op
} = require('sequelize')
const {
  flatten
} = require('lodash')

const {
  Movie,
  Sentence,
  Music
} = require('../module/classic')

const {
  Book
} = require('../module/book')


const {
  ArtType
} = require('../lib/enum')

class Art {
  constructor(artId, type) {
    this.artId = artId
    this.type = type
  }
  static async getData(artId, type) {
    let art = null
    let total = null
    const finder = {
      where: {
        id: artId
      }
    }
    switch (parseInt(type)) {
      case ArtType.MOVIE:
        art = await Movie.findOne(finder)
        break;
      case ArtType.MUSIC:
        art = await Music.findOne(finder)
        break;
      case ArtType.SENTENCE:
        art = await Sentence.findOne(finder)
        break;
      case ArtType.BOOK:
        art = await Book.getFavorBookCount(artId)
      default:
        break;
    }
    return art
  }
  static async getList(artInfoList) {
    const artInfoObj = {
      100: [],
      200: [],
      300: [],
    }
    for (let artInfo of artInfoList) {
      artInfoObj[artInfo.type].push(artInfo.artId)
    }
    const arts = []
    for (let key in artInfoObj) {
      const ids = artInfoObj[key]
      if (ids.length === 0) {
        continue
      }

      key = parseInt(key)
      arts.push(await Art._getListByType(ids, key))
    }

    return flatten(arts)
  }
  async getDetail(uid) {
    const {
      Favor
    } = require('../module/favor')
    const art = await Art.getData(this.artId, this.type)
    if (!art) {
      throw new global.errs.NotFound()
    }

    const like = await Favor.userLikeIt(
      this.artId, this.type, uid)
    return {
      art,
      likeStatus: like
    }
  }
  static async _getListByType(ids, type) {
    let arts = []
    const finder = {
      where: {
        id: {
          [Op.in]: ids
        }
      }
    }
    switch (type) {
      case ArtType.MOVIE:
        arts = await Movie.findAll(finder)
        break
      case ArtType.MUSIC:
        arts = await Music.findAll(finder)
        break
      case ArtType.SENTENCE:
        arts = await Sentence.findAll(finder)
      case 400:
        break
      default:
        break
    }
    return arts
  }
}

module.exports = {
  Art
}