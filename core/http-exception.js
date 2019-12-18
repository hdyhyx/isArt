class HttpException extends Error {
  constructor(msg = '服务器异常', errorCode = 10000, code = 400) {
    super()
    this.errorCode = errorCode
    this.code = code
    this.msg = msg
  }
}

class ParameterException extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 400
    this.msg = msg || '参数错误'
    this.errorCode = errorCode || 10000
  }
}

class AuthFailed extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.msg = msg || '授权失败'
    this.errorCode = errorCode || 10004
    this.code = 401
  }
}

class Forbidden extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 403
    this.msg = msg || '禁止访问'
    this.errorCode = errorCode || 10006
  }
}
class NotFound extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 404
    this.msg = msg || '暂无数据'
    this.errorCode = errorCode || 10006
  }
}

class linkError extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 400
    this.msg = msg || '你已经点赞过'
    this.errorCode = errorCode || 60001
  }
}
class DislikeError extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 400
    this.msg = msg || '你已经 取消点赞'
    this.errorCode = errorCode || 60002
  }
}

class Success extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 200
    this.msg = msg || 'success'
    this.errorCode = errorCode || 0
  }
}


module.exports = {
  HttpException,
  ParameterException,
  AuthFailed,
  NotFound,
  Forbidden,
  linkError,
  Success,
  DislikeError
}