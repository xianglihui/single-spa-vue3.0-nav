<template>
  <div class="navHeader">
    <!-- <nav-header></nav-header> -->
    <div>
      <outsideMenu />
      <!-- 左侧菜单 -->
      <div class="leftMenu">
        <div class="nav_logo">{{ title }}</div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, i) in crumbs" :key="i">
            {{ item.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="rightMenu" v-if="isLogin">
      <!-- <div class="single-tool" ref=""><slot name="tool"></slot></div> -->
      <div>
        <span class="node">欢迎，{{ userInfo.name }}</span>
        <span class="node" @click="logout">退出登陆</span>
      </div>
    </div>
    <div class="rightMenu" v-else>
      <span class="node" @click="$router.push('/login')">登陆</span>
    </div>
  </div>
</template>

<script lang="ts">
interface Crumbs {
  name: string;
}
import outsideMenu from "@/components/OutSideMenu.vue";
import {
  reactive,
  toRefs,
  ref,
  onMounted,
  defineComponent,
  watch,
  computed,
} from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default defineComponent({
  components: {
    outsideMenu,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const userToken = ref(sessionStorage.getItem("token"));
    const userInfo = ref(store.getters.getUserInfo);
    const state = reactive({
      title: "local-A",
      isLogin: false,
      crumbs: [] as Crumbs[],
    });
    console.log("userInfo", userInfo.value);

    // 检查登录状态
    const checkLoginStat = () => {
      if (userToken.value) state.isLogin = true;
      // userToken.value && state.isLogin == true;
    };
    // 退出登录
    const logout = () => {
      localStorage.clear();
      sessionStorage.clear();
      location.replace("/login?reLogin=true");
      // location.reload()
    };
    // 监听路由
    watch(route, () => {
      getCrumbs();
    });
    // 监听菜单
    // watch(Menus, () => {
    //   this.getCrumbs();
    // });
    // 计算属性
    // 总菜单
    const allMenu = computed(() => {
      console.log("store.getters.Menus", store.getters.Menus);
      return store.getters.Menus;
    });
    // 获取面包屑
    const getCrumbs = () => {
      state.crumbs = [];
      const menus: any = allMenu.value;
      if (menus.length > 0) {
        // menuPath默认0
        let menuPath: any = sessionStorage.getItem("menuPath") || "0";
        // 用当前路径去匹配当前系统菜单
        const curPath = "/" + route.path.split(/\//)[1];
        const curMenuFilter = allMenu.value.filter((item: any) => {
          return item.path == curPath;
        });
        // 一级面包屑
        const temp = { name: curMenuFilter[0].name };
        state.crumbs.push(temp);
        // 二级面包屑展示
        curMenuFilter[0].subMenu &&
          childCrubs(curMenuFilter[0].subMenu, 0, menuPath.split("-"));
      }
    };
    // 二级面包屑
    const childCrubs = (res: any, index: any, items: any) => {
      state.crumbs.push({
        name: res[items[index]] ? res[items[index]].name : "",
      });
      // 如果存在二级菜单
      if (res[items[index]] && res[items[index]].subMenu) {
        childCrubs(res[items[index]].subMenu, (index += 1), items);
      }
    };
    // onMounted
    onMounted(async () => {
      checkLoginStat();
    });
    return {
      ...toRefs(state),
      userInfo,
      logout,
      // getTestInfo,
    };
  },
});
</script>
<style scoped>
.navHeader {
  display: flex;
  justify-items: center;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  width: 100%;
  height: 45px;
  background: #fff;
  z-index: 2;
  border-bottom: 1px solid #eaeaea;
}
.navHeader .leftMenu {
  display: flex;
  align-items: center;
}
.navHeader .nav_logo {
  /* float: left; */
  /* height: 100%; */
  font-size: 26px;
  font-weight: 800;
  color: #0078d7;
  font-family: "微软雅黑";
  margin: 0 20px;
}
.single-tool > * {
  padding: 0px 0px 0px 12px;
}

.navHeader .rightMenu {
  /* float: right; */
  /* padding-right: 20px; */
  color: #777;
  line-height: 45px;
  display: flex;
  align-items: center;
}
.navHeader .rightMenu .node {
  position: relative;
  margin: 0 10px;
  cursor: pointer;
  font-size: 14px;
}
.navHeader .rightMenu .node:before {
  position: absolute;
  content: "";
  display: block;
  right: -10px;
  top: 4px;
  width: 1px;
  height: 14px;
  background: #999;
}
.navHeader .rightMenu .node:last-child:before {
  content: none;
}
.navHeader .el-breadcrumb {
  float: left;
  /* margin: 15px 0 0 46px; */
}
</style>
