const {
  Sequelize,
  Model,
  Op
} = require('sequelize');
const {
  sequelize
} = require('../../core/db')

const {
  Art
} = require('../module/art')

const {
  Book
} = require('../module/book')

class Favor extends Model {
  static async like(artId, type, uid) {
    const favor = await Favor.findOne({
      where: {
        artId,
        type,
        uid
      }
    })
    if (favor) {
      throw new global.errs.linkError();
    }
    return sequelize.transaction(async t => {
      await Favor.create({
        artId,
        type,
        uid
      }, {
        transaction: t
      })
      let art = await Art.getData(artId, type)
      await art.increment('favNums', {
        by: 1,
        transaction: t
      })
    })
  }
  static async dislike(artId, type, uid) {
    const favor = await Favor.findOne({
      where: {
        artId,
        type,
        uid
      }
    })
    if (!favor) {
      throw new global.errs.DislikeError;
    }
    return sequelize.transaction(async t => {
      await favor.destroy({
        force: true,
        transaction: t
      })
      const art = await Art.getData(artId, type)
      await art.decrement('favNums', {
        by: 1,
        transaction: t
      })
    })
  }
  static async getMyClassFavors(uid) {
    const arts = await Favor.findAll({
      where: {
        uid,
        type: {
          [Op.not]: 400
        }
      }
    })
    if (!arts) {
      throw new global.errs.NotFound()
    }
    return await Art.getList(arts)
  }
  static async userLikeIt(artId, type, uid) {
    const favor = await Favor.findOne({
      where: {
        artId,
        uid,
        type
      }
    })
    return !!favor
  }
}

Favor.init({
  artId: Sequelize.INTEGER,
  type: Sequelize.INTEGER,
  uid: Sequelize.STRING
}, {
  sequelize,
  tableName: 'favor'
})

module.exports = {
  Favor
}