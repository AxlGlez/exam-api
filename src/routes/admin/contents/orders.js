const authMiddleware = require('../../../middleware/auth')
const orders = require('../../../usecases/admin/contents/orders')

const SIZE = 10

module.exports = (router) => {
  router.post('/admin/add/order/:customerId', authMiddleware(), async (ctx, next) => {
    try {
      let { entradas, guisados, postres, bebidas } = { ...ctx.request.body }
      let payload = await orders.setNewOrder({ entradas, guisados, postres, bebidas, ...ctx.params })
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
  router.get('/admin/orders', async (ctx, next) => {
    try {
      const { page } = ctx.query
      let [ usersList, count ] = await orders.getOrdersList(page)
      ctx.body = {
        success: true,
        orders: usersList,
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
  router.post('/admin/delete/order', authMiddleware(), async (ctx, next) => {
    try {
      let { customerId, id } = { ...ctx.request.body }
      let payload = await orders.setDeleteOrder({ customerId, id })
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
  router.post('/admin/edit/order/:orderId', authMiddleware(), async (ctx, next) => {
    try {
      let { entradas, guisados, postres, bebidas } = { ...ctx.request.body }
      let { orderId } = ctx.params
      let payload = await orders.setEditOrder({ entradas, guisados, postres, bebidas, orderId })
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
