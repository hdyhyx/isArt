function isThisType(val) {
  for (let key in this) {
    if (this[key] === val) {
      return true
    }
  }
  return false
}



const LoginType = {
  USER_MINI_PROGRAM: 100,
  USER_MOBILE: 101,
  ADMIN_EMAIL: 200,
  isThisType
}

const LoginVerifyType = {
  USER_SMS_COED: 1,
  USER_PASSWORD: 2,
  isThisType
}

const ArtType = {
  MOVIE: 100,
  MUSIC: 200,
  SENTENCE: 300,
  BOOK: 400,
  isThisType
}

const notVerifyRouter = {
  routerArray: [
    '/v1/classic/latest',
    '/v1/classic/:index/next',
    '/v1/classic/:index/prev',
    '/v1/classic/:artId/:type/favor',
    '/v1/book/:bookId/:type/favor'
  ],
  isVerify: function (router) {
    for (let i = 0; i < this.routerArray.length; i++) {
      const item = this.routerArray[i];
      if (item === router) {
        return true
      }
    }
    return false
  }
}


module.exports = {
  LoginType,
  LoginVerifyType,
  ArtType,
  notVerifyRouter
}