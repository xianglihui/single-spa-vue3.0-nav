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
|-- README.md // md文件
|-- __json_server_mock__  // mock数据
|   `-- db.json
|-- babel.config.js
|-- package-lock.json
|-- package.json
|-- patches // router适配single-spa
|   `-- vue-router+4.0.10.patch
|-- public
|   |-- favicon.ico
|   `-- index.html
|-- src
|   |-- App.vue // 根文件
|   |-- api // api集中管理
|   |   |-- index.ts
|   |   `-- user.ts
|   |-- assets
|   |   |-- common.css
|   |   `-- img
|   |       `-- bg.jpg
|   |-- components
|   |   |-- ExtendNav.vue // 总菜单
|   |   |-- Main.vue // 挂载APP
|   |   |-- NavAside.vue // 侧边栏菜单
|   |   |-- NavHeader.vue // 头部header
|   |   `-- OutSideMenu.vue // 展开菜单
|   |-- main.ts
|   |-- models
|   |   `-- Models.ts // interface
|   |-- plugins
|   |   `-- permission.ts // 权限
|   |-- router
|   |   `-- index.ts // 路由
|   |-- shims-vue.d.ts
|   |-- store
|   |   |-- index.ts // vuex
|   |   `-- modules
|   |       `-- store.ts
|   |-- utils
|   |   |-- authorization.ts // 登录
|   |   |-- env.ts // 本地配置
|   |   |-- http.ts // 封装
|   |   `-- index.ts
|   `-- views
|       |-- About.vue
|       `-- Login.vue // 登录页
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
4. 面包屑 √
5. 账号登录，登录校验表单
6. 控制类中心侧边栏
7. 总菜单收藏 √
8. 总菜单外部系统显示 √
9. 域账号自动登录
10. 权限系统与 nav 交互
11. 权限控制 v-permission
12. 二级菜单展示

### single-spa 问题

1. 看注意事项 1
2. 路由监听连续触发两次

### bug

1. 刷新页面，分别触发路由监听和总菜单监听 source:components/NavAside line:186
2. App.vue 中 onMounted 里获取 route.mata 异常 source:App.vue line:121
3. 切换系统时，全局控制菜单弹出
