<template>
  <!-- 顶部面包屑 -->
  <nav-header v-if="isHideMenu"></nav-header>
  <div>
    <!-- <nav-aside v-show="!isHideMenu" v-if="!$store.getters.isMobile"></nav-aside> -->
    <div
      class="moduleContent navCollapse"
      :style="{
        width: `calc( 100% - ${navWidth}px)`,
        top: `${isLogin ? 46 : 0}px`,
      }"
    >
      <router-view />
    </div>
    <div class="moduleContent navCollapse" v-show="isHideMenu">
      <div id="root_app1"></div>
    </div>
  </div>
  <!-- <router-view /> -->
</template>
<script lang="ts">
import { onMounted, reactive, toRefs, watch } from "vue";
// import { onBeforeRouteUpdate } from "vue-router";
import NavHeader from "@/components/NavHeader.vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { GetMenuItems } from "@/utils/authorization";
export default {
  components: {
    NavHeader,
  },
  setup() {
    const state = reactive({
      isHideMenu: false,
      navWidth: 100,
      isLogin: true,
      erd: "",
    });
    const store = useStore();
    const route = useRoute();
    // isLogin(){
    //     return this.store.getters.isLogin
    // }
    // 路由监听 判断是否需要隐藏优惠券
    // onBeforeRouteUpdate(async (to) => {
    //   if (to.meta.isLogin) {
    //     state.isHideMenu = true;
    //     const menus = await GetMenuItems();
    //     store.commit("updateMenus", { Menus: menus });
    //   } else {
    //     state.isHideMenu = false;
    //   }
    // });
    watch(route, async (newval, oldval) => {
      console.log("watch监听route.meta", route.meta);
      if (route.meta.isLogin) {
        state.isHideMenu = true;
        const menus = await GetMenuItems();
        store.commit("updateMenus", { Menus: menus });
      } else {
        state.isHideMenu = false;
        console.log('state.isHideMenu',state.isHideMenu)
        // sessionStorage.clear();
        // localStorage.clear();
      }
    });
    onMounted(async () => {
      // 初始化
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
};
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
  width: calc(100% - 65px);
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
