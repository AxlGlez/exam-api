const clone = require('lodash/clone')

function filterBody (body) {
  if (typeof body === 'string') {
    body = JSON.parse(body)
  }
  let obj = clone(body)
  if ('password' in obj) {
    obj.password = '<password>'
  }
  if ('token' in obj) {
    obj.token = '<token>'
  }
  return JSON.stringify(obj)
}

const env = process.env.TEST !== 'true'

module.exports = async (ctx, next) => {
  try {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    env && console.log(`[${ctx.status}] ${ctx.method} ${ctx.url} - ${ms}ms, query: ${JSON.stringify(ctx.query)}, body: ${filterBody(ctx.request.body)}, at ${(new Date()).toISOString()}`)
  } catch (error) {
    console.log(`[${ctx.status}] ${ctx.method} ${ctx.url}, query: ${JSON.stringify(ctx.query)}, body: ${filterBody(ctx.request.body)}, at ${(new Date()).toISOString()}`)
    console.error(error)
    throw error
  }
}
