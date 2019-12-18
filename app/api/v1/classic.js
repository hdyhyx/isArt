const Router = require('koa-router')
const {
  Flow
} = require('../../module/flow')
const {
  Art
} = require('../../module/art')
const {
  Favor
} = require('../../module/favor')
const {
  Auth
} = require('../../../middlewares/auth')
const {
  PositiveIntegerValidator,
  ClassicValidator
} = require('../../../validator/classic')


const router = new Router({
  prefix: '/v1/classic'
})

router.get('/latest', new Auth().m, async (ctx, next) => {
  const flow = await Flow.findOne({
    order: [
      ['index', 'DESC']
    ]
  })
  if (!flow) {
    throw new global.errs.NotFound('暂无数据')
  }
  const art = await Art.getData(flow.artId, flow.type)
  if (!ctx.auth || !ctx.auth.uid) {
    art.setDataValue('likeStatus', false)
  } else {
    const likeLatest = await Favor.userLikeIt(art.id, art.type, ctx.auth.uid)
    art.setDataValue('likeStatus', likeLatest)
  }
  art.setDataValue('index', flow.index)
  ctx.body = art
})

router.get('/:index/next', new Auth().m, async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  })
  let index = v.get('path.index')
  const flow = await Flow.findOne({
    where: {
      index: index + 1
    }
  })
  if (!flow) {
    throw new global.errs.NotFound();
  }
  const art = await Art.getData(flow.artId, flow.type)
  if (!ctx.auth || !ctx.auth.uid) {
    art.setDataValue('likeStatus', false)
  } else {
    const likeLatest = await Favor.userLikeIt(art.id, art.type, ctx.auth.uid)
    art.setDataValue('likeStatus', likeLatest)
  }
  art.setDataValue('index', flow.index)
  ctx.body = art
})

router.get('/:index/prev', new Auth().m, async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  })
  let index = v.get('path.index')
  const flow = await Flow.findOne({
    where: {
      index: index - 1
    }
  })
  if (!flow) {
    throw new global.errs.NotFound();
  }
  const art = await Art.getData(flow.artId, flow.type)
  if (!ctx.auth || !ctx.auth.uid) {
    art.setDataValue('likeStatus', false)
  } else {
    const likeLatest = await Favor.userLikeIt(art.id, art.type, ctx.auth.uid)
    art.setDataValue('likeStatus', likeLatest)
  }
  art.setDataValue('index', flow.index)
  ctx.body = art
})

router.get('/:artId/:type/favor', new Auth().m, async (ctx, next) => {
  const v = await new ClassicValidator().validate(ctx, {
    id: 'artId'
  })
  const artId = v.get('path.artId')
  const type = v.get('path.type')
  let art = null
  let likeStatus = false
  if (!ctx.auth || !ctx.auth.uid) {
    art = await Art.getData(artId, type)
  } else {
    const arts = await new Art(artId, type).getDetail(ctx.auth.uid)
    likeStatus = arts.likeStatus
    art = arts.art
  }
  ctx.body = {
    favNums: art.favNums,
    likeStatus
  }
})

router.get('/favor', new Auth().m, async (ctx, next) => {
  const classics = await Favor.getMyClassFavors(ctx.auth.uid)
  ctx.body = classics
})


module.exports = router