const jwt = require('jsonwebtoken')
const validator = require('validator');
const client = require('../db/redis')
const config = require('../config')
const { success, error } = require('../lib/utils/response')

const User = require('../model/users')

const Sequelize = require('sequelize')
const Op = Sequelize.Op;

// 从redis获取用户信息
const getUserByRedis = async (token) => {
  return await new Promise((resolve, reject) => {
    client.get(token, (err, value) => {
      if (value) {
        value = JSON.parse(value)
      }
      resolve(value)
    })
  })
}

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

  const user = await getUserByRedis(token)
  
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
  const username = body.username
  const password = body.password

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
  const id = body.id
  const username = body.username
  const password = body.password
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
  const username = body.username
  const password = body.password

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
        username: username,
        password: password
      }
    })

    if (!user) {
      ctx.body = error({
        message: '密码错误'
      })
      return
    }
    
    const token = jwt.sign({
      userId: user.id
    }, config.secret, {
      expiresIn: 60 * 60   // 1小时过期
    });

    client.set(token, JSON.stringify(user))
    client.expire(token,60 * 60);
  
    ctx.body = success({
      data: token
    })
  } catch (e) {
    ctx.body = error({
      message: e
    })
  }
}