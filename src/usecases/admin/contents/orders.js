const knex = require('../../../db/knex')
const errors = require('../../../constants/errors')
const messages = require('../../../constants/messages')
const pageSize = 10

module.exports = {
  async setNewOrder ({ entradas, guisados, postres, bebidas, customerId }) {
    try {
      await knex.transaction(async trx => {
        const [id] = await trx('orders')
          .returning('id')
          .insert({
            entradas,
            guisados,
            postres,
            bebidas,
            customer_id: customerId
          })
        if (!id) throw new Error(errors.CONTENT.ORDER_NOT_CREATED)
      })
      return {
        message: messages.ORDER_CREATED
      }
    } catch (error) {
      console.log(error)
      throw new Error(errors.CONTENT.ORDER_NOT_CREATED)
    }
  },
  async getOrdersList (page = 1) {
    try {
      let offset = ((page < 1 ? 1 : page) - 1) * pageSize
      const orders = await knex.select([
        'orders.id',
        'orders.entradas',
        'orders.guisados',
        'orders.postres',
        'orders.bebidas',
        'orders.created_at',
        'orders.customer_id',
        knex.raw(`CONCAT(customers.name, ' ', customers.last_name, ' ', customers.second_last_name) as name`)
      ])
        .from('orders')
        .innerJoin('customers', 'customers.id', 'orders.customer_id')
        .orderBy('created_at', 'asc')
        .limit(pageSize)
        .offset(offset)
      let count = await knex.count()
        .from('orders')
        .then(([query]) => parseInt(query.count, 10))
      if (!orders) throw new Error(errors.USERS.USERS_LIST_NOT_FOUND)
      return [ orders, count ]
    } catch (error) {
      console.log(error)
      throw new Error(errors.USERS.USERS_LIST_NOT_FOUND)
    }
  },
  async setDeleteOrder ({ customerId, id }) {
    try {
      const resp = await knex('orders')
        .where('customer_id', customerId)
        .where('id', id)
        .del()
      console.log('resp', resp)
      if (!resp) throw new Error(errors.CONTENT.ORDER_NOT_CREATED)
      return {
        message: messages.ORDER_DELETED
      }
    } catch (error) {
      console.log(error)
      throw new Error(errors.CONTENT.ORDER_NOT_CREATED)
    }
  },
  async setEditOrder ({ entradas, guisados, postres, bebidas, orderId }) {
    try {
      const resp = await knex('orders')
        .where('id', orderId)
        .update({
          entradas,
          guisados,
          postres,
          bebidas
        })
      if (!resp) throw new Error(errors.CONTENT.ORDER_NOT_CREATED)
      return {
        message: messages.ORDER_EDIT
      }
    } catch (error) {
      console.log(error)
      throw new Error(errors.CONTENT.ORDER_NOT_CREATED)
    }
  }
}
