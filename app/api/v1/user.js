const Router = require('koa-router')

const {
  RegisterValidator,
  ExpireTimeValidator,
  LoginValidator
} = require('../../../validator/user')
const {
  User,
  Code
} = require('../../module/user')
const {
  createCode,
  createUid
} = require('../../../core/util')
const {
  LoginType
} = require('../../lib/enum')


const router = new Router({
  prefix: '/v1/user'
})

router.post('/register', async (ctx, next) => {
  const v = await new RegisterValidator().validate(ctx)
  await Code.validateExpireTime(v.get('body.phone'), v.get('body.code'))
  const user = {
    id: createUid(),
    phone: v.get('body.phone'),
    password: v.get('body.password1'),
    nickname: v.get('body.nickname')
  }
  const result = await User.create(user)
})

router.post('/login', async (ctx, next) => {
  const v = await new LoginValidator().validate(ctx)
  switch (v.get('body.type')) {
    case LoginType.USER_MOBILE:

      break;
    case LoginType.USER_MINI_PROGRAM:

      break;
    default:
      break;
  }
})

router.post('/validateCode', async (ctx, next) => {
  const v = await new ExpireTimeValidator().validate(ctx)
  const code = {
    phone: v.get('body.phone'),
    code: createCode(),
    expireTime: getExpireTime()
  }
  const result = await Code.create(code)
})

//手机号码登录
function loginTypePwdAndCode(ctx) {

}

// 短信验证码过期时间
function getExpireTime() {
  let date = new Date()
  let min = date.getMinutes()
  date.setMinutes(min + 1)
  return date.toJSON()
}

module.exports = router