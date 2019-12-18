const {
  Sequelize,
  Model
} = require('sequelize');
const {
  sequelize
} = require('../../core/db')

const classicFields = {
  image: Sequelize.STRING,
  content: Sequelize.STRING,
  pubdate: Sequelize.DATEONLY,
  favNums: Sequelize.INTEGER,
  title: Sequelize.STRING,
  type: Sequelize.INTEGER
}


class Movie extends Model {}
Movie.init(classicFields, {
  sequelize,
  tableName: 'movie'
})

class Sentence extends Model {}
Sentence.init(classicFields, {
  sequelize,
  tableName: 'sentence'
})


class Music extends Model {}

const musicFields = Object.assign(classicFields, {
  url: Sequelize.STRING
})

Music.init(musicFields, {
  sequelize,
  tableName: 'music'
})

module.exports = {
  Movie,
  Music,
  Sentence
}