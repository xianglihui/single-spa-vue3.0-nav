import { h, createApp } from "vue";
import singleSpaVue from "single-spa-vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/common.css";
import "element-plus/lib/theme-chalk/index.css";
import store from "@/store/index";
import ElementPlus from "element-plus";
import { env, Eenv } from "@/utils/env";
// router.beforeEach((to, from, next) => {
//   console.log("to", to);
//   console.log("from", from);
//   // if (to.meta.title) {
//   //   document.title = to.meta.title;
//   // }
//   next();
// });
// console.log("main.ts");
console.log("env===", env);
console.log("process.env.NODE_ENV", process.env);
console.log("Eenv.local", Eenv.local);
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
    app.directive("permission", {
      inserted: (
        el: { parentNode: { removeChild: (arg0: any) => void } | null },
        binding: { value: any } /*, vnode*/
      ) => {
        console.log("env===", env);
        if (env === Eenv.local) {
          return;
        }
        const permission =
          localStorage.premission && localStorage.premission.length > 0
            ? JSON.parse(localStorage.premission)
            : [];
        if (!permission.includes(binding.value)) {
          if (el.parentNode !== null) {
            el.parentNode.removeChild(el);
          }
        }
      },
    });
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
