## koa使用JWT认证

### JSON Web Token
[JSON Web Token](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)（缩写 JWT）是目前最流行的跨域认证解决方案 

### 开始
With npm
```
  $ npm install
  $ npm run dev
```
With yarn
```
$ yarn install
$ yarn dev
```

### 目录结构
```
|-- koa-jwt-login
    # 命令
    |-- bin
    |   |-- www
    # 配置
    |-- config
    |   |-- index.js
    # 控制器模块
    |-- controller
    |   |-- users.js
    # 数据库实例
    |-- db  
    |   |-- config.js
    |   |-- mysql.js
    |   |-- redis.js
    # 工具库
    |-- lib
    |   |-- utils
    |       |-- log.js
    |       |-- response.js
    # 记录日志
    |-- logs
    # 中间件
    |-- middleware
    |   |-- auth.js
    |   |-- index.js
    |   |-- security.js
    # 数据模型
    |-- model
    |   |-- users.js
    |-- public
    |   |-- stylesheets
    |       |-- style.css
    # 路由定义
    |-- routes
    |   |-- index.js
    |   |-- users.js
    # 调用第三方服务
    |-- servers
    |   |-- index.js
    # 视图
    |-- views
    |   |-- error.pug
    |   |-- index.pug
    |   |-- layout.pug
    |-- app.js
    |-- package.json
    |-- yarn.lock    
    |-- README.md
```

### 资料
[Sequelize](https://itbilu.com/nodejs/npm/VkYIaRPz-.html#induction) [Redis](https://www.npmjs.com/package/redis)