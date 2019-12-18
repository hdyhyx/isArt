const bcrypt = require('bcryptjs')
const {
  Sequelize,
  Model
} = require('sequelize');
const {
  sequelize
} = require('../../core/db')
const {
  hasExpireTime
} = require('../../core/util')
const {
  LoginVerifyType
} = require('../lib/enum')

class User extends Model {
  static async getUserByOpenid(openid) {
    const user = await User.findOne({
      where: {
        openid
      }
    })
    return user
  }

  static async createUserByOpenid(openid, uid) {
    const user = await User.create({
      openid,
      id: uid
    })
    return user
  }

  static async loginTypePwdOrSMS(phone, plainPassword, code, verifyType) {
    const user = await User.findOne({
      where: {
        phone
      }
    })
    if (!user) {
      throw new global.errs.AuthFailed('该用户不存在')
    }
    switch (verifyType) {
      //短信验证登录
      case LoginVerifyType.USER_SMS_COED:
        await Code.validateExpireTime(phone, code)
        break;
        //密码登录
      case LoginVerifyType.USER_PASSWORD:
        const correct = bcrypt.compareSync(
          plainPassword, user.password)
        if (!correct) {
          throw new global.errs.AuthFailed('密码不正确')
        }
        break;

      default:
        break;
    }
    if (LoginVerifyType.USER_PASSWORD === verifyType) {

    }
    return user
  }
}
User.init({
  id: {
    type: Sequelize.STRING(8),
    primaryKey: true
  },
  nickname: Sequelize.STRING,
  phone: {
    type: Sequelize.STRING(11),
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    set(val) {
      // 加密
      const salt = bcrypt.genSaltSync(10)
      // 生成加密密码
      const psw = bcrypt.hashSync(val, salt)
      this.setDataValue("password", psw)
    }
  },
  openid: {
    type: Sequelize.STRING(64),
    unique: true
  },
}, {
  sequelize,
  tableName: 'user'
})

class Code extends Model {
  // 验证code是否过期
  static async validateExpireTime(phone, code) {
    const isPhone = await Code.findOne({
      where: {
        phone,
        code
      },
      order: [
        ['id', 'DESC']
      ]
    })
    if (!isPhone) {
      throw new global.errs.ParameterException('请重新获取验证码')
    }
    let isExpireTime = hasExpireTime(isPhone)
    if (isExpireTime && isPhone.dataValues.phone === phone) {
      throw new global.errs.ParameterException('验证已过期')
    }
  }
}
Code.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  phone: {
    type: Sequelize.STRING(11)
  },
  code: {
    type: Sequelize.STRING(6)
  },
  expireTime: {
    type: Sequelize.DATE
  }
}, {
  sequelize,
  tableName: 'code'
})

module.exports = {
  User,
  Code
}