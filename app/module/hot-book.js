const {
  Sequelize,
  Model,
  Op
} = require('sequelize');

const {
  sequelize
} = require('../../core/db')

const {
  Favor
} = require('./favor')

const {
  Book
} = require('./book')
class HotBook extends Model {
  static async getAll() {
    const hotBooks = await HotBook.findAll({
      order: ['index']
    })
    const ids = []
    hotBooks.forEach(book => {
      ids.push(book.index)
    })
    const books = await Book.findAll({
      id: {
        [Op.in]: ids
      },
      type: 400
    })
    // const favors = await Favor.findAll({
    //   where: {
    //     artId: {
    //       [Op.in]: ids
    //     },
    //     type: 400
    //   },
    //   group: ['artId'],
    //   attributes: ['artId', [Sequelize.fn('COUNT', '*'), 'count']]
    // })
    // books.forEach(book => {
    //   HotBook._getEachBookStatus(book, favors)
    // })
    return books
  }
  // static _getEachBookStatus(book, favors) {
  //   let count = 0
  //   favors.forEach(favor => {
  //     if (book.id === favor.art_id) {
  //       count = favor.get('count')
  //     }
  //   })
  //   book.setDataValue('favNums', count)
  //   return book
  // }
}

HotBook.init({
  index: Sequelize.INTEGER,
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  }
}, {
  sequelize,
  tableName: 'hot_book'
})

module.exports = {
  HotBook
}