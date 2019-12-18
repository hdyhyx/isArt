const Router = require('koa-router')
const {
  Auth
} = require('../../../middlewares/auth');
const {
  NotEmptyValidator
} = require('../../../validator/token')
const router = new Router()
router.post('/v1/token/verify', async (ctx, next) => {
  const v = await new NotEmptyValidator().validate(ctx)
  const result = Auth.verifyToken(v.get('body.token'))
  ctx.body = {
    isValid: result
  }
})

module.exports = router