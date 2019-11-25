const {
  Op
} = require('sequelize')
const schedule = require('node-schedule');
const {
  Code
} = require('../module/user')
const SMSRemoveTask = () => {
  //每天凌晨一点清除code表
  schedule.scheduleJob('0 0 1 * * *', async () => {
    const result = await Code.destroy({
      force: true,
      where: {
        expireTime: {
          [Op.lte]: new Date().toJSON()
        }
      }
    })
    console.log('SMSRemoveTask:' + new Date());
  });
}

module.exports = SMSRemoveTask