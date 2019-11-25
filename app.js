const Koa = require('koa')
const Router = require('koa-router')
const parser = require('koa-bodyparser')
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')
const SMSRemoveTask = require('./app/lib/tiemed-task')
const app = new Koa()

SMSRemoveTask()
app.use(catchError)
app.use(parser())
InitManager.initCore(app)

app.listen(3000)