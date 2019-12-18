const Router = require('koa-router')
const {
  Auth
} = require('../../../middlewares/auth')
const {
  HotBook
} = require('../../module/hot-book')
const {
  Book
} = require('../../module/book')
const {
  Art
} = require('../../module/art')
const {
  Favor
} = require('../../module/favor')
const {
  Comment
} = require('../../module/book-comment')
const {
  ClassicValidator
} = require('../../../validator/classic')
const {
  PositiveIntegerValidator,
  CommentValidator,
  BookSearchValidator
} = require('../../../validator/book')
const {
  handleResult
} = require('../../lib/helper')

const router = new Router({
  prefix: '/v1/book'
})

router.get('/hotList', async (ctx, next) => {
  const hotList = await HotBook.getAll()
  ctx.body = hotList
})

router.get('/:id/detail', async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const book = new Book()
  ctx.body = await book.detail(v.get('path.id'))
})

router.get('/:bookId/:type/favor', new Auth().m, async ctx => {
  const v = await new ClassicValidator().validate(ctx, {
    id: 'bookId'
  })
  const artId = v.get('path.bookId')
  const type = v.get('path.type')
  let book = await Art.getData(artId, type)
  if (!ctx.auth || !ctx.auth.uid) {
    book.setDataValue('likeStatus', false)
  } else {
    likeStatus = await Favor.userLikeIt(artId, type, ctx.auth.uid)
    book.setDataValue('likeStatus', likeStatus)
  }
  ctx.body = {
    likeStatus: book.getDataValue('likeStatus'),
    favNums: book.favNums
  }
})

router.get('/favor/count', new Auth().m, async ctx => {
  const count = await Book.getMyFavorBookCount(ctx.auth.uid)
  ctx.body = {
    count
  }
})

router.get('/:bookId/shortComment', async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'bookId'
  })
  const bookId = v.get('path.bookId')
  const comments = await Comment.getComments(bookId)
  ctx.body = comments
})

router.post('/add/shortComment', new Auth().m, async (ctx, next) => {
  const v = await new CommentValidator().validate(ctx, {
    id: 'bookId'
  })
  const bookId = v.get('body.bookId')
  const content = v.get('body.content')
  Comment.addComment(bookId, content)
  handleResult()
})

router.get('/search', async (ctx, next) => {
  const v = await new BookSearchValidator().validate(ctx)
  const start = v.get('query.start') || 0
  const count = v.get('query.count') || 10
  const summary = v.get('query.summary') || 1
  const q = v.get('query.q')
  const r = await Book.searchFromYuShu(q, start, count, summary)
  ctx.body = r
})

router.get('/hotKeyword', async ctx => {
  ctx.body = {
    'hot': [
      'Python',
      '哈利·波特',
      '村上春树',
      '东野圭吾',
      '白夜行',
      '韩寒',
      '金庸',
      '王小波'
    ]
  }
})


module.exports = router