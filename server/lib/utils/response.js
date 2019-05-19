
exports.success = (opts = {}) => {
  const {data, message } = opts
  return {
    code: 200,
    data: data || null,
    message: message || '成功'
  }
}

exports.error = (opts = {}) => {
  const {data , message } = opts
  return {
    code: 4000,
    data: data || null,
    message: message || '失败'
  }
}

exports.tokenMalformed = () => {
  return {
    code: 1000,
    data: null,
    message: 'token 异常'
  }
}
