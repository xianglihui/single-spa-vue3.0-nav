<template>
  <!-- 顶部面包屑 -->
  <nav-header v-if="!isHideMenu"></nav-header>
  <div>
    <nav-aside v-if="!isHideMenu"></nav-aside>
    <div
      class="moduleContent navCollapse"
      :style="{
        width: `calc( 100% - ${navWidth}px)`,
        top: `${isLogin ? 46 : 0}px`,
      }"
    >
      <router-view />
    </div>
    <!--navWidth，navHeight配置是为了适配 single-spa环境的nav和header -->
    <div
      class="moduleContent navCollapse"
      :style="{
        width: `calc( 100% - ${navWidth}px)`,
        height: `calc(100% - ${navHeight}px)`,
        overflow: 'auto',
      }"
      v-show="!isHideMenu"
    >
      <main-app />
    </div>
  </div>
  <!-- <router-view /> -->
</template>
<script lang="ts">
import {
  onMounted,
  reactive,
  toRefs,
  watch,
  defineComponent,
  toRaw,
  ref,
  markRaw,
} from "vue";
// import { onBeforeRouteUpdate } from "vue-router";
import NavHeader from "@/components/NavHeader.vue";
import NavAside from "@/components/NavAside.vue";
import MainApp from "@/components/Main.vue";
import { useStore } from "vuex";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { GetMenuItems } from "@/utils/authorization";
// definComponent主要是用来帮助Vue在TS下正确推断出setup()组件的参数类型;引入 defineComponent() 以正确推断 setup() 组件的参数类型；defineComponent 可以正确适配无 props、数组 props 等形式；
export default defineComponent({
  components: {
    NavHeader,
    NavAside,
    MainApp,
  },
  setup() {
    const state = reactive({
      isHideMenu: true,
      navWidth: 240,
      navHeight: 46,
      isLogin: true,
      erd: "",
    });
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    console.log("APP.vue执行");
    // if (window.history) {
    //   console.log("--------");
    //   history.pushState(null, "", document.URL);
    //   window.addEventListener(
    //     "popstate",
    //     () => {
    //       // if (!localGet("token")) {
    //       //   state.showMenu = false;
    //       // }
    //       console.log("===========");
    //       state.isHideMenu = true;
    //     },
    //     false
    //   );
    // }
    // router.beforeEach((to, from) => {
    //   console.log("to", to);
    //   console.log("from", from);
    // });
    watch(
      route,
      () => {
        console.log("监听router的跳转");
        console.log(
          "route.meta",
          Object.prototype.hasOwnProperty.call(route.meta, "isLogin")
        );
        if (Object.prototype.hasOwnProperty.call(route.meta, "isLogin")) {
          state.isHideMenu = true;
        } else {
          state.isHideMenu = false;
        }
      },
      { deep: true }
    );
    // isLogin(){
    //     return this.store.getters.isLogin
    // }
    // watch(
    //   () => store,
    //   (val, old) => {
    //     console.log("watch监听store", store);
    //   }
    // );
    onBeforeRouteUpdate((to) => {
      console.log("=====", to);
    });
    console.log("router.options.routes", router.options.routes);
    onMounted(async () => {
      (window as any).route = (path: string, query: any = {}) => {
        router.push({ path, query: query });
      };
      /**
       * hasOwnProperty() 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键）。
       * 任何页面刷新都会触发App onMounted
       * 我的思路是：用户刷新页面时，如果当前路由meta上不存在isLogin这个key，就会判断是否存在token，存在就拿菜单渲染，反之清空缓存跳转登录
       * 我的目的是：设置isLogin这个key时，就不需要往下执行，如登录页，刷新页面是不需要执行条件中的逻辑
       * bug：121正常打印，122正常打印，输出meta对象，能够看到meta中是有数据的，123行打印却为空对象，更新数据会正常打印,这在vue2.x中是正常的，在vue3.0可能是个bug
       * 解决方案：应该可以通过路由导航中to.meta拿到对象，存入缓存，在app.vue中再取出来判断，未落实 2021-8-14
       */
      // console.log("APP onMounted");
      // 注释相关打印 将route转为普通数据导致页面跳转时监听不到route 2021-8-18
      // console.log("---route---", toRaw(route));
      // console.log("---toRaw(route).meta---", toRaw(route).meta);
      // console.log("---toRaw(route).meta._value---", toRaw(route).meta.value);
      // console.log("---mark---", markRaw(route));
      if (!Object.prototype.hasOwnProperty.call(route, "isLogin")) {
        console.log("---hasOwnProperty---");
        if (sessionStorage.getItem("token")) {
          const menus = await GetMenuItems();
          store.commit("updateMenus", { Menus: menus });
        } else {
          sessionStorage.clear();
          localStorage.clear();
          router.push({ path: "/login" });
        }
      }
      // setInterval(() => {
      //   state.erd.listenTo(
      //     document.getElementsByClassName("leftNav"),
      //     (element: any) => {
      //       state.navWidth = element.offsetWidth - 1;
      //     }
      //   );
      // }, 100);
    });
    return {
      ...toRefs(state),
      // getTestInfo,
    };
  },
});
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.moduleContent {
  width: calc(100% - 240px);
  position: fixed;
  right: 0;
  bottom: 0;
  overflow: auto;
  .navCollapse {
    -moz-transition: width 0.3s linear;
    -webkit-transition: width 0.3s linear;
    transition: width 0.3s linear;
  }
}
</style>
