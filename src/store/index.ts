// 这里跟vue2有点区别，vue2中是直接导入vue，然后通过vue.use(xxx)
import { createStore } from "vuex";
import store from "./modules/store";
//因为我把模块拆分了，但是我又不想每次都导入，就通过这个自动导入modules目录下的模块
export default createStore({
  modules: {
    store,
  },
  // 启用严格模式,非mutation改变值都会报错
  strict: true,
});
