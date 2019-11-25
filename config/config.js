module.exports = {
  environment: 'dev',
  database: {
    dbName: 'hdy',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456'
  },
  validateCode: {
    url: 'http://smssh1.253.com/msg/send/json',
    account: 'N5322426',
    password: '',
    msg: (code) => {
      return `${code}`
    }
  }
}