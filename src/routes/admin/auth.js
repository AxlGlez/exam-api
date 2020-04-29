const authMiddleware = require('../../middleware/auth')
const auth = require('../../usecases/admin/auth')

module.exports = (router) => {
  router.post('/admin/auth/login', async (ctx, next) => {
    try {
      let payload = await auth.signIn(ctx.request.body)
      ctx.body = {
        success: true,
        ...payload
      }
      return next()
    } catch (error) {
      console.error(error)
      ctx.status = 400
      ctx.body = {
        success: false,
        error: error.message
      }
      return next()
    }
  })

  router.get('/admin/auth/validate-session', authMiddleware(), async (ctx, next) => {
    try {
      let payload = await auth.validateSession(ctx.user)
      ctx.body = {
        success: true,
        ...payload
      }
      return next()
    } catch (error) {
      console.error(error)
      ctx.status = 400
      ctx.body = {
        success: false,
        error: error.message
      }
      return next()
    }
  })
}
