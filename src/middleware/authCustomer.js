const knex = require('../db/knex')
const errors = require('../constants/errors')

const jwt = require('../lib/jwt')

module.exports = () => async (ctx, next) => {
  if ('authorization' in ctx.request.headers) {
    try {
      let jwtDecoded = await jwt.verify(ctx.request.headers.authorization)
      let user = await knex.first([
        'users.username',
        'users.id'
      ])
        .from('users')
        .where('users.id', jwtDecoded.id)
        .andWhere('active', true)

      let rolTestPassed = true
      if (rolTestPassed && user) {
        ctx.user = user
        return next()
      } else {
        ctx.status = 401
        ctx.body = {
          success: false,
          message: errors.AUTH.UNAUTHORIZED
        }
      }
    } catch (error) {
      console.error(error)
      ctx.status = 401
      ctx.body = {
        success: false,
        message: errors.AUTH.INVALID_TOKEN
      }
    }
  } else {
    ctx.status = 401
    ctx.body = {
      success: false,
      message: errors.AUTH.UNAUTHORIZED
    }
  }
}
