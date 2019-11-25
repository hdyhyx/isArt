const requireDirectory = require('require-directory')
const Router = require('koa-router')
class InitManager {
  static initCore(app) {
    //入口方法
    InitManager.app = app
    InitManager.initLoadRouter()
    InitManager.initLoadConfig()
    InitManager.initLoadError()
  }
  static initLoadRouter() {
    const apiDirectory = `${process.cwd()}/app/api`
    requireDirectory(module, apiDirectory, {
      visit: whenLoadModule
    })

    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes())
      }
    }
  }
  static initLoadConfig() {
    const config = require(`${process.cwd()}/config/config`)
    global.config = config
  }
  static initLoadError() {
    const errs = require(`${process.cwd()}/core/http-exception`)
    global.errs = errs
  }
}

module.exports = InitManager