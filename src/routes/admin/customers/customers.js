const authMiddleware = require('../../../middleware/auth')
const customers = require('../../../usecases/admin/customers/customers')

const SIZE = 10

module.exports = (router) => {
  router.post('/admin/add/customer', authMiddleware(), async (ctx, next) => {
    try {
      let payload = await customers.createCustomer(ctx.request.body)
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
  router.get('/admin/customers', async (ctx, next) => {
    try {
      const { page } = ctx.query
      let [ usersList, count ] = await customers.getCustomerList(page)
      ctx.body = {
        success: true,
        users: usersList,
        total: count,
        totalPages: Math.ceil(count / SIZE)
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
  router.put('/admin/customer/:customerId', authMiddleware(), async (ctx, next) => {
    try {
      const { customerId } = ctx.params
      let payload = await customers.customerUpdate(customerId, ctx.request.body)
      ctx.body = {
        success: true,
        message: 'Se actualizo la información correctamente',
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
  router.get('/admin/customer/:customerId/detail', authMiddleware(), async (ctx, next) => {
    try {
      let { customerId } = ctx.params
      let payload = await customers.getCustomerDetail(customerId)
      ctx.body = {
        success: true,
        payload
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
  router.get('/admin/customer/reviewOrder/:customerId', authMiddleware(), async (ctx, next) => {
    try {
      let { customerId } = ctx.params
      let payload = await customers.reviewOrderLimit(customerId)
      ctx.body = {
        success: true,
        payload
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
