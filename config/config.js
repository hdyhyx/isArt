module.exports = {
  environment: 'dev',
  database: {
    dbName: 'hdy',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: ''
  },
  validateSMS: {
    url: 'http://smssh1.253.com/msg/send/json',
    account: 'N5322426',
    password: '',
    msg: (code) => {
      return `${code}`
    }
  },
  security: {
    secretKey: "abcdefg",
    // 过期时间 1小时
    expiresIn: 60
  },
  wx: {
    appId: 'wxe744452b0904f1a8',
    appSecret: 'cdee6cfd0dd26789a4235f2b83d3a1b5',
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
  },
  host: 'http://192.168.10.78:3000/',
  yushu: {
    detailUrl: 'http://t.yushu.im/v2/book/id/%s',
    keywordUrl: 'http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s'
  }
}