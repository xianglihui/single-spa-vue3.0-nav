import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  useRoute,
} from "vue-router";
import Login from "../views/Login.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "登录",
      isLogin: false,
    },
  },
  {
    path: "/",
    redirect: "/login",
    meta: {
      title: "localNav",
      isLogin: false,
    },
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
/**
 * 路由错误回调
 */
router.onError((e: any) => {
  console.log("error:", e);
});
router.beforeEach((to, from) => {
  console.log("to", to);
  if (to.matched.length == 0) {
    console.log("to.path", to.path);
  }
  // console.log("from", from);
  // if (to.path === from.path) {
  //   return false;
  // }
  // if (!to.meta.isLogin || !from.meta.isLogin) {
  //   if (sessionStorage.getItem("token")) {
  //     console.log("--------");
  //   }
  // }
  // return false
});

// if (!route.meta.hasOwnProperty("isLogin")) {
//   console.log("1");
// }
export default router;
