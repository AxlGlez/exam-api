const knex = require('../../../db/knex')
const errors = require('../../../constants/errors')
const moment = require('moment')

const pageSize = 10

module.exports = {
  async createCustomer (data) {
    try {
      return knex('customers')
        .insert({
          ...data
        })
    } catch (error) {
      console.log(error)
      throw new Error(errors.USERS.USERS_LIST_NOT_FOUND)
    }
  },
  async getCustomerList (page = 1) {
    try {
      let offset = ((page < 1 ? 1 : page) - 1) * pageSize
      const users = await knex.select([
        'id',
        'name',
        'last_name',
        'second_last_name',
        'created_at',
        'email',
        'age'
      ])
        .from('customers')
        .orderBy('created_at', 'asc')
        .limit(pageSize)
        .offset(offset)
      let count = await knex.count()
        .from('customers')
        .then(([query]) => parseInt(query.count, 10))
      if (!users) throw new Error(errors.USERS.USERS_LIST_NOT_FOUND)
      return [ users, count ]
    } catch (error) {
      console.log(error)
      throw new Error(errors.USERS.USERS_LIST_NOT_FOUND)
    }
  },
  async customerUpdate (customerId, body) {
    const cleanMail = body.email ? body.email.trim() : undefined
    const cleanName = body.name ? body.name.trim() : undefined
    const cleanLastName = body.lastName ? body.lastName.trim() : undefined
    const cleanSecondLastName = body.secondLastName ? body.secondLastName.trim() : undefined

    if (!cleanLastName || !cleanName || !cleanSecondLastName || !cleanMail) throw new Error(errors.ADMIN_USERS.INCOMPLETE_DATA_USER_UPDATED)
    try {
      return await knex('customers')
        .where('id', customerId)
        .update({
          name: cleanName,
          last_name: cleanLastName,
          second_last_name: cleanSecondLastName,
          email: cleanMail,
          updated: moment()
        })
    } catch (error) {
      console.log(error)
      throw new Error(errors.ADMIN_USERS.USER_NOT_UPDATED)
    }
  },
  async getCustomerDetail (customerId) {
    try {
      const user = await knex.first([
        'name',
        'last_name',
        'second_last_name',
        'age'
      ])
        .from('customers')
        .where('id', customerId)
      if (!user) throw new Error(errors.USERS.USER_NOT_FOUND)
      return user
    } catch (error) {
      console.log(error)
      throw new Error(errors.USERS.USER_NOT_FOUND)
    }
  },
  async reviewOrderLimit (customerId) {
    try {
      const user = await
        knex.raw(`SELECT count(id) FROM orders where created_at::date = current_date and customer_id = ${customerId}`)
      if (!user) throw new Error(errors.USERS.USER_NOT_FOUND)
      return user.rows
    } catch (error) {
      console.log(error)
      throw new Error(errors.USERS.USER_NOT_FOUND)
    }
  }
}
