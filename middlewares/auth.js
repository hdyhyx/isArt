const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const {
  notVerifyRouter
} = require('../app/lib/enum')
class Auth {
  constructor() {
    this.level = 1
  }
  get m() {
    return async (ctx, next) => {
      const tokenToken = basicAuth(ctx.req)
      let errMsg = "token不合法"
      if (!tokenToken || !tokenToken.name) {
        //可以不需token路由

        if (notVerifyRouter.isVerify(ctx._matchedRoute)) {
          return await next()
        }
        throw new global.errs.Forbidden(errMsg)
      }

      try {
        var decode = jwt.decode(tokenToken.name, global.config.security.secretKey)
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          errMsg = "token已过期"
        }
        throw new global.errs.Forbidden(errMsg)
      }
      if (decode.scope <= this.level) {
        errMsg = "权限不足"
        throw new global.errs.Forbidden(errMsg)
      }
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
      }
      await next()
    }
  }
  static verifyToken(token) {
    try {
      jwt.verify(token, global.config.security.secretKey)
      return true
    } catch (error) {
      return false
    }
  }
}

module.exports = {
  Auth
}