const {
  Sequelize,
  Model
} = require('sequelize');
const axios = require('axios')
const util = require('util')
const {
  sequelize
} = require('../../core/db')


class Book extends Model {
  async detail(id) {
    const url = util.format(global.config.yushu.detailUrl, id)
    const detail = await axios.get(url)
    return detail.data
  }

  static async getMyFavorBookCount(uid) {
    const {
      Favor
    } = require('./favor')
    const count = await Favor.count({
      where: {
        type: 400,
        uid
      }
    })
    return count
  }

  static async getFavorBookCount(bookId) {
    let book = await Book.findOne({
      where: {
        id: bookId
      }
    })
    if (!book) {
      book = await new Book().detail(bookId)
      book = Object.assign(book, {
        author: book.author.join(','),
        favNums: 0,
        type: 400
      })
      book = Book.create(book)
    }
    return book
  }

  static async searchFromYuShu(q, start = 0, count = 10, summary = 1) {
    const url = util.format(
      global.config.yushu.keywordUrl, encodeURI(q), count, start, summary)
    const result = await axios.get(url)
    return result.data
  }
}

Book.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  favNums: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  type: {
    type: Sequelize.INTEGER
  },
  index: Sequelize.INTEGER,
  image: Sequelize.STRING,
  author: Sequelize.STRING,
  title: Sequelize.STRING
}, {
  sequelize,
  tableName: 'book'
})

module.exports = {
  Book
}