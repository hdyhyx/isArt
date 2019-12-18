const {
  Rule,
  LinValidator
} = require('../core/lin-validator-v2')

const {
  ArtType
} = require('../app/lib/enum')

class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', '需要正整数', {
        min: 1
      })
    ]
  }
}

class CommentValidator extends PositiveIntegerValidator {
  constructor() {
    super()
    this.content = [
      new Rule('isLength', '长度超出限制', {
        min: 1,
        max: 12
      })
    ]
  }
}

class BookSearchValidator extends LinValidator {
  constructor() {
    super()
    this.start = [
      new Rule('isOptional'),
      new Rule('isInt', '需要正整数')
    ]
    this.count = [
      new Rule('isOptional'),
      new Rule('isInt', '需要正整数')
    ]
    this.summary = [
      new Rule('isOptional'),
      new Rule('isInt', '需要正整数')
    ]
  }
}

module.exports = {
  PositiveIntegerValidator,
  CommentValidator,
  BookSearchValidator
}