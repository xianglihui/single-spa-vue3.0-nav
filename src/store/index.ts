// 这里跟vue2有点区别，vue2中是直接导入vue，然后通过vue.use(xxx)
import { createStore } from "vuex";

//因为我把模块拆分了，但是我又不想每次都导入，就通过这个自动导入modules目录下的模块
const modulesFiles = require.context("./modules", true, /.ts$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  // @ts-ignore
  modules.moduleName = value.default;
  return modules;
}, {});

// 调用createStore
export default createStore({
  modules,
});
