const {security} = require('../config')

module.exports =  async (ctx, next) => {
  if (security && security.csrf) {
    if (security.csrf.ignore && security.csrf.ignore(ctx) === false) {
      ctx.status = 403
      await ctx.render('error', {
        message: 'Forbidden',
        error: {
          status: 403
        }
      })
      
      return
    }
  }

  await next()
}