const {
  HttpException
} = require('../core/http-exception')
const catchError = async (ctx, next) => {
  try {
    await next()

  } catch (error) {
    // 开发环境
    const isHttpException = error instanceof HttpException
    const isDev = global.config.environment === 'dev'

    if (isDev && !isHttpException) {
      throw error
    }
    // 生成环境
    if (isHttpException) {
      ctx.body = {
        msg: error.msg,
        errorCode: error.errorCode,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = error.code

    } else {
      ctx.body = {
        msg: "未知错误！",
        errorCode: 9999,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}
module.exports = catchError