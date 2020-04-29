
require('dotenv').config({path: '../../.env'})
const USER_DB = process.env.USER_DB
const PASSWORD_DB = process.env.PASSWORD_DB
const DATABASE = process.env.DATABASE
const HOST_DB = process.env.HOST_DB

module.exports = require('knex')({
  client: 'pg',
  connection: `postgres://${USER_DB}:${PASSWORD_DB}@${HOST_DB}:5432/${DATABASE}?ssl=true`
})
