### desc
vue3.0+ts+single-spa搭建的子项目导航系统
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
目前存在与vue-router兼容性问题。https://github.com/single-spa/create-single-spa/issues/311

### 本地开发
本地开发环境注意注释 el: "#root_nav"，这段代码是为了在single-spa环境下，能够作为路由容器提供挂载功能挂载

