const {
  Rule,
  LinValidator
} = require('../core/lin-validator-v2')
const {
  User,
  Code
} = require('../app/module/user')
const {
  hasExpireTime
} = require('../core/util')
const {
  LoginType
} = require('../app/lib/enum')


const PHONE_REG = RegExp(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/)

class PhoneValidator extends LinValidator {
  constructor() {
    super()
    this.phone = [
      new Rule('matches', '手机号码不符合规范', PHONE_REG)
    ]
  }
  async validatePhone(vals) {
    const phone = vals.body.phone
    const isPhone = await User.findOne({
      where: {
        phone
      }
    })
    if (isPhone) {
      throw new Error('手机号码已被注册')
    }
  }
}

class ExpireTimeValidator extends PhoneValidator {
  constructor() {
    super()
  }
  async validateExpireTime(vals) {
    const phone = vals.body.phone
    const isPhone = await Code.findOne({
      where: {
        phone
      },
      order: [
        ['id', 'DESC']
      ]
    })
    if (isPhone) {
      let isExpireTime = hasExpireTime(isPhone)
      if (!isExpireTime && isPhone.dataValues.phone === phone) {
        throw new Error('手机短信验证频繁')
      }
    }
  }
}



class RegisterValidator extends PhoneValidator {
  constructor() {
    super()
    this.code = [
      new Rule('isLength', '是6个字符', {
        min: 6,
        max: 6
      })
    ]
    this.password1 = [
      // 用户密码指定范围
      new Rule('isLength', '密码至少6个字符，最多22个字符', {
        min: 6,
        max: 22
      }),
      new Rule(
        'matches',
        '密码长度必须在6~22位之间，包含字符、数字和 _ ',
        '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]'
      )
    ]
    this.password2 = this.password1
  }

  validatePassword(vals) {
    const psw1 = vals.body.password1
    const psw2 = vals.body.password2
    if (psw1 !== psw2) {
      throw new Error('两次输入的密码不一致，请重新输入')
    }
  }
}

class LoginValidator extends LinValidator {
  constructor() {
    super()
    this.account = [
      new Rule('matches', '手机号码不符合规范', PHONE_REG)
    ]
    this.secret = [
      new Rule('isOptional'),
      new Rule('isLength', '至少6个字符', {
        min: 6,
        max: 128
      })
    ]
    this.code = [
      new Rule('isOptional'),
      new Rule('isLength', '是6个字符', {
        min: 6,
        max: 6
      })
    ]
  }
  validatePhoneAndCode(vals) {
    if (!vals.body.code && !vals.body.secret) {
      throw new Error('请选择一种方式登录')
    }
  }
  validateLoginType(vals) {
    if (!vals.body.type) {
      throw new Error('type是必须参数')
    }
    if (!LoginType.isThisType(vals.body.type)) {
      throw new Error('type参数不合法')
    }

  }
}



module.exports = {
  RegisterValidator,
  ExpireTimeValidator,
  LoginValidator
}