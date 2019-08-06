const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')
const validator = require('validator')
const {client} = require('../db/redis')
const config = require('../config')
const jwt = require('../lib/jwt')
const { success, error } = require('../lib/utils/response')
const User = require('../model/users')

const Op = Sequelize.Op
const saltRounds = 10

/**
 * 获取列表
 */
exports.getList = async (ctx, next) => {
  const query = ctx.request.query
  const keyword = query.keyword || ''
  const currentPage = Number(query.currentPage)
  const pageSize = Number(query.pageSize)
  const offset = (currentPage - 1) * pageSize
  
  const where  = {}
  if (keyword) {
    where.username = {
      [Op.like]: '%' + keyword + '%'
    }
  }

  // const allUsers = await User.findAll()

  const users = await User.findAll({
    where: where,
    offset: offset,
    limit: pageSize
  })

  ctx.body = success({
    data: {
      list: users
    }
  })
}

/**
 * 获取用户信息
 */
exports.getUserInfo = async (ctx, next) => {
  const token = ctx.request.header.token

  const user = await client.get(token)
  
  ctx.body = success({
    data: user
  })
}

/**
 * 删除用户
 */
exports.deleteUser = async (ctx, next) => {
  const body = ctx.request.body
  const id = body.id

  const user = await User.destroy({
    where: {
      id: id
    }
  })

  ctx.body = success()
}

/**
 * 注册
 */
const register = async (ctx, next) => {
  const body = ctx.request.body
  let { username, password } = body

  const user = await User.findOne({
    where: {
      username: username
    }
  })
  
  if (user) {
    ctx.body = error({
      message: '该账号已注册'
    })
    return
  }

  await bcrypt.hash(password, saltRounds).then((hash) => {
    password = hash
  })

  await User.create({
    username: username,
    password: password,
  })

  ctx.body = success()
}


/**
 * 添加用户、更新
 */
exports.saveUser = async (ctx, next) => {
  const body = ctx.request.body
  const { id, username, password } = body
  if (!id) {
    await register(ctx, next)
    return
  } else {
    await User.update({
      username: username,
      password: password,
    },{
      where: {
        id: id
      }
    })
  }

  ctx.body = success()
}


/**
 * 注册
 */
exports.register = register

/**
 * 登陆
 */
exports.login = async (ctx, next) => {
  const body = ctx.request.body
  const { username, password } = body

  if (validator.isEmpty(username) || validator.isEmpty(password)) {
    ctx.body = error({
      message: '参数错误'
    })
    return
  }

  try {
    let user = await User.findOne({
      where: {
        username: username
      }
    })

    if (!user) {
      ctx.body = error({
        message: '该账号不存在'
      })
      return
    }


    user = await User.findOne({
      where: {
        username: username
      }
    })

    if (!user) {
      ctx.body = error({
        message: '不存在该用户'
      })
      return
    }

    let isequal
    await bcrypt.compare(password, user.password).then(function(res) {
      isequal = res === true
    })

    if (!isequal) {
      ctx.body = error({
        message: '密码错误'
      })
      return
    }

    // 获取token
    const token = jwt.sign({
      id: user.id,
      username: user.username
    })

    // 缓存token
    client.set(token, user, config.tokenExpiresTime)
    client.set(`user_${user.id}`, token, config.tokenExpiresTime)

    ctx.body = success({
      data: token
    })
  } catch (e) {
    ctx.body = error({
      message: e.message
    })
  }
}

/**
 * 退出登录
 */
exports.logout = async (ctx, next) => {
  const token = ctx.request.header.token
  try {
    const user = await client.get(token)

    // 设置token过期
    jwt.signout({
      id: user.id,
      username: user.username
    })

    // 删除缓存
    client.remove(token)
    client.remove(`user_${user.id}`)

    ctx.body = success()
  } catch (e) {
    ctx.body = error({
      message: e.message
    })
  }
}