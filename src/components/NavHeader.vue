<template>
  <div class="navHeader">
    <!-- <outside-menu></outside-menu> -->
    <!-- <nav-header></nav-header> -->
    <div class="leftMenu">
      <div class="nav_logo">{{ title }}</div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, i) in crumbs" :key="i">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="rightMenu" v-if="isLogin">
      <!-- <div class="lsd-tool" ref=""><slot name="tool"></slot></div> -->
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
// import OutsideMenu from "@/components/OutSideMenu.vue";
import { reactive, toRefs, ref, onMounted, defineComponent } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  setup() {
    const store = useStore();
    const userToken = ref(sessionStorage.getItem("token"));
    const userInfo = ref(store.getters.getUserInfo);
    const state = reactive({
      title: "local-A",
      isLogin: false,
      crumbs: [
        {
          name: "首页",
          path: "/home",
        },
        {
          name: "系统设置",
          path: "/setting",
        },
        {
          name: "用户管理",
          path: "/setting/usermanage",
        },
      ],
    });
    console.log("userInfo", userInfo.value);
    // 检查登录状态
    const checkLoginStat = () => {
      if (userToken.value) state.isLogin = true;
      // userToken.value && state.isLogin == true;
    };
    const logout = () => {
      localStorage.clear();
      sessionStorage.clear();
      // this.$router.push("/login?reLogin=true")
      location.replace("/login?reLogin=true");
      // location.reload()
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
.lsd-tool > * {
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
