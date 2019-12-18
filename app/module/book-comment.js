const {
  Sequelize,
  Model
} = require('sequelize');

const {
  sequelize
} = require('../../core/db')

class Comment extends Model {
  static async addComment(bookId, content) {
    const comment = await Comment.findOne({
      where: {
        bookId,
        content
      }
    })
    if (!comment) {
      return await Comment.create({
        bookId,
        content,
        nums: 1
      })
    } else {
      return await comment.increment('nums', {
        by: 1
      })
    }
  }

  static async getComments(bookId) {
    const comments = Comment.findAll({
      where: {
        bookId
      }
    })
    return comments
  }
}

Comment.init({
  bookId: Sequelize.INTEGER,
  content: Sequelize.STRING(12),
  nums: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  tableName: 'comment'
})

module.exports = {
  Comment
}