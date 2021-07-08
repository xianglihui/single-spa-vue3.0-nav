<template>
  <div class="navHeader">
    <outside-menu></outside-menu>
    <div class="lsd_logo">{{ title }}</div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item, i) in crumbs" :key="i">
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="rightMenu" v-if="isLogin">
      <div class="lsd-tool" ref=""><slot name="tool"></slot></div>
      <div>
        <span class="node">欢迎，{{ userUserInfo.name }}</span>
        <span v-show="app_name == 'Portal'">
          <span class="node" @click="$router.push({ name: 'SysIndex' })">
            {{ companyInfo.name || "" }}
          </span>
        </span>
        <span class="node" @click="logout">退出登陆</span>
      </div>
    </div>
    <div class="rightMenu" v-else>
      <span class="node" @click="$router.push('/login')">登陆</span>
    </div>
  </div>
</template>

<script lang="ts">
import OutsideMenu from "@/components/OutSideMenu.vue";
import { reactive, toRefs } from "vue";
export default {
  components: {
    OutsideMenu,
  },
  setup() {
    const state = reactive({
      title: "System",
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
    return {
      ...toRefs(state),
      // getTestInfo,
    };
  },
};
</script>
<style scoped>
.navHeader .lsd_logo {
  float: left;
  /* height: 100%; */
  font-size: 26px;
  font-weight: 800;
  color: #0078d7;
  display: flex;
  justify-items: center;
  align-items: center;
  font-family: "微软雅黑";
}
.lsd-tool > * {
  padding: 0px 0px 0px 12px;
}
.navHeader {
  position: fixed;
  width: 100%;
  height: 45px;
  background: #fff;
  z-index: 2;
  border-bottom: 1px solid #eaeaea;
}

.navHeader .rightMenu {
  float: right;
  padding-right: 20px;
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
  margin: 15px 0 0 46px;
}
</style>
