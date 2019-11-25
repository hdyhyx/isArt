const Router = require('koa-router')
const router = new Router()
const {
  HttpException,
  ParameterException
} = require('../../../core/http-exception')
router.get('/v1/:id/classic/latest', (ctx, next) => {
  const params = ctx.params
  const query = ctx.request.query
  const headers = ctx.request.header
  const body = ctx.request.body
  if (true) {
    const error = new ParameterException()
    throw error
  }
  ctx.body = {
    key: 'classic'
  }
})

module.exports = router