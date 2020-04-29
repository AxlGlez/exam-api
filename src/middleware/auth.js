const knex = require('../db/knex')
const errors = require('../constants/errors')

const jwt = require('../lib/jwt')

module.exports = () => async (ctx, next) => {
  if ('authorization' in ctx.request.headers) {
    try {
      let jwtDecoded = await jwt.verify(ctx.request.headers.authorization)
      let user = await knex.first([
        'admin_user.email',
        'admin_user.id'
      ])
        .from('admin_user')
        .where('admin_user.id', jwtDecoded.id)
        .andWhere('active', true)

      let rolTestPassed = true
      if (rolTestPassed && user) {
        ctx.user = user
        return next()
      } else {
        ctx.throw(401, errors.AUTH.UNAUTHORIZED)
      }
    } catch (error) {
      console.error(error)
      ctx.throw(401, errors.AUTH.INVALID_TOKEN)
    }
  } else {
    ctx.throw(401, errors.AUTH.UNAUTHORIZED)
  }
}
