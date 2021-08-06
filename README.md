### desc

vue3.0+ts+single-spa 搭建的子项目导航系统

### 目录结构

Setup:

```sh
# single-spa 环境
npm install
npm run json-server
npm run plstinstall
npm run serve

# 本地环境
npm install
npm run json-server
npm run plstinstall
npm run serve:standalone
```

```
项目结构
|-- README.md
|-- __json_server_mock__
|   `-- db.json
|-- babel.config.js
|-- package-lock.json
|-- package.json
|-- public
|   |-- favicon.ico
|   `-- index.html
|-- src
|   |-- App.vue
|   |-- api
|   |   |-- index.ts
|   |   `-- user.ts
|   |-- assets
|   |   |-- common.css
|   |   `-- img
|   |       `-- bg.jpg
|   |-- components
|   |   |-- Main.vue
|   |   |-- NavHeader.vue
|   |   `-- OutSideMenu.vue
|   |-- main.ts
|   |-- models
|   |   `-- Models.ts
|   |-- router
|   |   `-- index.ts
|   |-- shims-vue.d.ts
|   |-- store
|   |   |-- index.ts
|   |   `-- modules
|   |       `-- store.ts
|   |-- utils
|   |   |-- authorization.ts
|   |   |-- env.ts
|   |   `-- http.ts
|   `-- views
|       |-- About.vue
|       `-- Login.vue
`-- tsconfig.json
```

### 注意事项

1. 目前存在与 vue-router 兼容性问题。https://github.com/single-spa/create-single-spa/issues/311

### 本地开发

本地开发环境注意注释 el: "#root_nav"，这段代码是为了在 single-spa 环境下，能够作为路由容器提供挂载功能

### 暂未解决的业务问题

1. 切换其他子系统，侧边栏未发生变化 √
2. 刷新页面，保持侧边栏状态 √
3. 侧边栏收缩/展开 √
4. 面包屑
5. 账号登录，登录校验表单
6. 控制类中心侧边栏
7. 总菜单收藏
8. 总菜单外部系统显示 √
9. 域账号登录
10. 权限系统与nav交互
11. 权限控制v-permission

### single-spa 问题

1. 看注意事项 1
2. 路由监听连续触发两次

### bug

1. 刷新页面，分别触发路由监听和总菜单监听 source:components/NavAside line:186
