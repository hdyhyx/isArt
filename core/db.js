const {
  Sequelize,
  Model
} = require('sequelize');
const {
  clone,
  unset,
  isArray
} = require('lodash')
const {
  dbName,
  user,
  port,
  host,
  password,
} = require('../config/config').database
const sequelize = new Sequelize(dbName, user, password, {
  host,
  port,
  dialect: 'mysql',
  logging: true,
  timezone: '+08:00', //服务器时间
  define: {
    underscored: true, //转换列名的驼峰命名规则为下划线命令规则
    paranoid: true, //	使用逻辑删除。设置为true后，调用 destroy 方法时将不会删队模型，而是设置一个 deletedAt 列。此设置需要 timestamps=true
    timestamps: true, //为模型添加 createdAt 和 updatedAt 两个时间戳字段
    freezeTableName: true, // Model 对应的表名将与model名相同
    createdAt: 'created_at', // 别名
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
})
// 创建模型
sequelize.sync({
  force: false
})

Model.prototype.toJSON = function () {
  // let data = this.dataValues
  let data = clone(this.dataValues)
  unset(data, 'updated_at')
  unset(data, 'created_at')
  unset(data, 'deleted_at')

  for (key in data) {
    if (key === 'image') {
      if (!data[key].startsWith('http'))
        data[key] = global.config.host + data[key]
    }
  }

  if (isArray(this.exclude)) {
    this.exclude.forEach(
      (value) => {
        unset(data, value)
      }
    )
  }
  return data
}

module.exports = {
  sequelize
}
module.exports = {
  sequelize
}