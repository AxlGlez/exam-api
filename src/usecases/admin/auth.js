const knex = require('../../db/knex')
const jwt = require('../../lib/jwt')
const bcrypt = require('../../lib/bcrypt')
const errors = require('../../constants/errors')

module.exports = {
  async signIn ({ email = '', password = '' }) {
    let cleanUser = email.trim()
    if (!email || !password) throw new Error('Ingresa tus accesos')
    let usuario = await knex.first(['admin_user.email',
      'admin_user.active',
      'admin_user.password',
      'admin_user.id'])
      .from('admin_user')
      .where('email', cleanUser)

    if (!usuario) throw new Error(errors.AUTH.INCORRECT_ACCESS)
    if (!usuario.active) throw new Error(errors.AUTH.SUSPENDED_ACCOUNT)
    let verified = await bcrypt.verify(usuario.password, password)
    if (!verified) throw new Error(errors.AUTH.INCORRECT_ACCESS)

    let token = await jwt.create({ id: usuario.id })

    return {
      token
    }
  },

  async validateSession (userToken) {
    try {
      let user = await knex.first(['admin_user.email',
        'admin_user.active',
        'admin_user.password',
        'admin_user.id',
        knex.raw(`CONCAT(admin_user.name, ' ', admin_user.last_name, ' ', admin_user.second_last_name) as name`)
      ])
        .from('admin_user')
        .where('admin_user.id', userToken.id)
      const newToken = await jwt.create({ id: user.id })
      return {
        success: true,
        token: newToken,
        email: user.email,
        name: user.name
      }
    } catch (error) {
      console.log(error)
      throw new Error(errors.AUTH.UNAUTHORIZED)
    }
  }
}
