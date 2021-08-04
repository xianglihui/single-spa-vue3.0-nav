import { h, createApp } from "vue";
import singleSpaVue from "single-spa-vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/common.css";
import "element-plus/lib/theme-chalk/index.css";
import store from "@/store/index";
import ElementPlus from "element-plus";
// router.beforeEach((to, from, next) => {
//   console.log("to", to);
//   console.log("from", from);
//   // if (to.meta.title) {
//   //   document.title = to.meta.title;
//   // }
//   next();
// });
// console.log("main.ts");
const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    // el: "#root_nav", // 本地开发需要注释
    render() {
      return h(App, {
        // single-spa props are available on the "this" object. Forward them to your component as needed.
        // https://single-spa.js.org/docs/building-applications#lifecyle-props
        // if you uncomment these, remember to add matching prop definitions for them in your App.vue file.
        /*
        name: this.name,
        mountParcel: this.mountParcel,
        singleSpa: this.singleSpa,
        */
      });
    },
  },
  handleInstance(app) {
    app.use(router);
    app.use(store);
    app.use(ElementPlus);
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
