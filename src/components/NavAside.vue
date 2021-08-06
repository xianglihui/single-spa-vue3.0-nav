<template>
  <div class="leftNav">
    <!-- collapse 是否水平折叠收起菜单 -->
    <div :class="{ menuMain: true, is_alive: !isNavCollapse }">
      <el-menu
        class="el-menu-vertical"
        :default-active="defaultActive"
        :unique-opened="true"
        :collapse="isNavCollapse"
        @select="handleSelect"
      >
        <template v-for="(menu1, index1) in curMenuData">
          <!-- 有二级菜单 -->
          <el-submenu
            v-if="menu1.subMenu && menu1.subMenu.length"
            :index="index1.toString()"
            :key="index1"
          >
            <template
              ><i class="iconfont" :class="menu1.icon"></i>
              <span>{{ menu1.name }}</span></template
            >
            <template v-for="(menu2, index2) in menu1.subMenu">
              <el-submenu
                v-if="menu2.subMenu && menu2.subMenu.length"
                :index="index1 + '-' + index2"
                :key="index2"
              >
                <template>
                  <i class="iconfont" :class="menu2.icon"></i>
                  <span>{{ menu2.name }}</span>
                </template>
                <template v-for="(menu3, index3) in menu2.subMenu">
                  <el-submenu
                    v-if="menu3.subMenu && menu3.subMenu.length"
                    :index="index1 + '-' + index2 + '-' + index3"
                    :key="menu3.id"
                  >
                    <template>
                      <i class="iconfont" :class="menu3.icon"></i>
                      <span @click="redirect(menu3)">{{ menu3.name }}</span>
                    </template>
                    <el-menu-item
                      v-for="(menu4, index4) in menu3.subMenu"
                      :index="
                        index1 + '-' + index2 + '-' + index3 + '-' + index4
                      "
                      :key="index4"
                      @click="redirect(menu4)"
                    >
                      <template>
                        <i class="iconfont" :class="menu4.icon"></i>
                        <span>{{ menu4.name }}</span>
                      </template>
                    </el-menu-item>
                  </el-submenu>
                  <el-menu-item
                    v-else
                    :index="index1 + '-' + index2 + '-' + index3"
                    :key="index3"
                    @click="redirect(menu3)"
                  >
                    <template>
                      <i class="iconfont" :class="menu3.icon"></i>
                      <span>{{ menu3.name }}</span>
                    </template>
                  </el-menu-item>
                </template>
              </el-submenu>
            </template>
          </el-submenu>
          <!-- 无二级菜单 -->
          <el-menu-item
            v-else
            :index="index1.toString()"
            :key="menu1.id"
            @click="redirect(menu1)"
          >
            <i class="iconfont" :class="menu1.icon"></i>
            <span>{{ menu1.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
      <!-- 系统设置 -->
      <div class="bottomBtnWrap" :class="[isNavCollapse ? 'close' : 'open']">
        <el-button
          type="text"
          class="popButton"
          @click="
            () => {
              isResetNavIndex = true;
              handleShowCfg();
            }
          "
        >
          <i class="el-icon-s-tools"></i>
          <label class="tt">系统设置</label>
        </el-button>
        <i
          :class="[
            !isNavCollapse ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right',
          ]"
          @click="toggleMenu()"
        ></i>
      </div>
    </div>
    <!-- 控制中心 -->
    <div
      class="menuCfg"
      :style="{
        width: `${isShowCfg ? 200 : 0}px`,
        borderRight: `${isShowCfg ? 1 : 0}px solid #eee`,
      }"
    >
      <!-- <setting ref="config" /> -->
    </div>
  </div>
</template>

<script lang="ts">
interface MenuData {
  name: string;
  icon?: string;
  path?: string;
  subMenu?: MenuData[];
  active?: boolean;
  prem?: string;
  [propertyName: string]: any;
}
interface CommonAnyObject {
  [propertyName: string]: any;
}
import {
  reactive,
  toRefs,
  ref,
  onMounted,
  defineComponent,
  watch,
  computed,
  toRef,
  watchEffect,
} from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      curMenuData: [] as Array<MenuData>,
      // Menus: store.getters.Menus,
      curCrumbsDictLabel: "",
      crumbsDict: {} as CommonAnyObject,
      refreshMenu: [], // 刷新页面拿到的menu
      isResetNavIndex: true, //重置系统锚点
      // isCollapse: false, // 是否水平展开
    });
    const isCollapse = ref(false);
    // 总菜单
    const allMenu = computed(() => {
      return store.getters.Menus;
    });
    // console.log("state.Menus", state.Menus);
    const defaultActive = ref("");
    // const isShowCfg = ref("");
    const menuPath = ref(""); // 用户选择menu时的下标
    // const curCrumbsDictLabel = ref("");
    // 菜单label锚点
    const handleSelect = (key: string, keyPath: string) => {
      menuPath.value = key;
      console.log("key", key);
      sessionStorage.setItem("menuPath", key);
      localStorage.setItem("menuPath", key);
    };
    // 是否展示控制中心 系统设置弹出层
    const isShowCfg = computed(() => {
      return store.getters.getIsShowCfg;
    });
    console.log("isShowCfg", isShowCfg.value);
    /**
     * 根据锚点激活菜单的index
     * 1.在当前系统菜单切换时需要设置锚点
     * 2.在全部系统菜单中时需要设置锚点
     */
    const getDefaultActive = () => {
      defaultActive.value = isShowCfg.value
        ? "0"
        : sessionStorage.getItem("menuPath") || "0";
      console.log("当前激活菜单的index", defaultActive.value);
    };
    // 系统锚点
    const navIndex = computed(() => {
      return store.getters.navIndex;
    });
    // 拿菜单
    const getCurMenuData = () => {
      getDefaultActive(); //获取当前选中label的index
      // console.log("激活getCurMenuData", state.Menus);
      if (allMenu.value.length == 0) {
        return [];
      } else {
        // 根据锚点跳转
        // return allMenu.value[navIndex.value].subMenu;
        return state.refreshMenu;
      }
    };
    // 抽离路径筛选方法
    const publicPath = () => {
      const curPath = "/" + route.path.split(/\//)[1];
      const curMenuFilter = allMenu.value.filter((item: any) => {
        return item.path == curPath;
      });
      state.refreshMenu = curMenuFilter[0].subMenu;
      state.curMenuData = getCurMenuData();
    };
    /**
     * 监听所有菜单
     * Menus immediate 配置非惰性，进入触发
     *用户刷新浏览器菜单状态会发生改变，监听所有菜单，所以切换系统/label时不会触发
     */
    watch(
      allMenu.value,
      () => {
        publicPath();
        // state.curMenuData = getCurMenuData();
        console.log("navaside激活curMenuData", state.curMenuData);
        /**
         * 防止single-spa环境下 用户刷新页面nav重置
         * 目前方案有二：
         * 1、往localstorage中打标记(锚点)，拿到当前菜单的index，刷新后去筛选拿到nav
         * 2、刷新页面时，获取当前页面参数，截取url，再匹配
         */
        // 当前路由
        // const curPath = "/" + route.path.split(/\//)[1];
        // 根据路径筛选当前菜单
        // const curMenuFilter = allMenu.value.filter((item: any) => {
        //   return item.path == curPath;
        // });
        // state.refreshMenu = curMenuFilter[0].subMenu;
      },
      { immediate: true }
    );
    /**
     * 监听route
     * 菜单label切换时,包括切换系统时路由都会发生变化，刷新页面不会发生触发
     * bug：刷新页面，分别触发路由监听和总菜单监听
     * 场景：刷新页面，路由未发生变更，应该是不会触发监听，但是在当前环境下触发监听，目前还未找到原因 2021-08-06
     * 在vue2.x，"vue-router": "^3.0.3",版本暂未发现出现该问题
     */
    watch(route, () => {
      console.log("navaside激活route");
      publicPath();
      // state.curMenuData = getCurMenuData();
      console.log("state.curMenuData", state.curMenuData);
    });
    // 点击菜单
    const redirect = (item: any) => {
      console.log("---获取总菜单---", allMenu.value);
      if (item.path) {
        // this.createCrumbs()
        // this.createCrumbsDict(this.menuData, "")
        let curPath: string = route.path + location.search;
        state.curCrumbsDictLabel = state.crumbsDict[curPath];
        // 面包屑
        store.commit("updateCrumbs", {
          crumbs: state.curCrumbsDictLabel,
        });
        if (item.isCollapse) {
          toggleMenu();
        }

        // const currentPaths = ((route.query as any).from || "").split("/");
        // const navPaths = item.path.split("/");
        // 更新锚点
        // state.isResetNavIndex = currentPaths[1] == navPaths[1] ? true : false;

        // if (state.isShowCfg) {
        //   this.handleShowCfg();
        // }
        // 存 系统锚点
        // sessionStorage.setItem("NavIndex", navIndex.value);
        // localStorage.setItem("NavIndex", navIndex.value);
        // 关闭菜单
        // store.commit("updateTopCollapse", { isTopCollapse: false });
        router.push(item.path);
      }
    };
    const handleShowCfg = () => {
      store.commit("updateShowCfg", { isShowCfg: !isShowCfg.value });
      store.commit("updateTopCollapse", { isTopCollapse: false });
      if (isShowCfg.value) {
        // const toPath = (config as any).menus[
        //   sessionStorage.getItem("cfgIndex") || 0
        // ].path;
        // allMenu.value.forEach((v: any) => {
        //   if (toPath.indexOf(v.path) > -1) {
        //     this.curMenuData = v.subMenu;
        //     this.defaultActive = "0";
        //   }
        // });
        // this.$store.commit(
        //   "updateNavIndex",
        //   this.Menus.findIndex((res: any) => {
        //     return toPath.indexOf(res.path) > -1;
        //   })
        // );
        // this.$router.push({ path: toPath, query: { from: this.$route.path } });
      }
    };
    // 是否菜单栏水平折叠
    const isNavCollapse = computed(() => {
      return store.getters.getNavCollapse;
    });
    console.log("是否菜单栏水平折叠", isNavCollapse);
    // watch(isNavCollapse.value, (newval, oldval) => {
    //   console.log("isNavCollapse====", isNavCollapse);
    //   console.log("newval", newval);
    //   console.log("oldval", oldval);
    // });
    console.log("isNavCollapse outside", isNavCollapse.value);
    // 水平展开
    const toggleMenu = () => {
      isCollapse.value = !isCollapse.value;
      // 更新vuex状态
      console.log("state.isCollapse,", isCollapse.value);
      store.commit("updateNavCollapse", isCollapse.value
      // {
      //   // isNavCollapse: isCollapse.value,
      //   isNavCollapse: isNavCollapse.value,
      // }
      );
      // console.log("state.isCollapse,", isCollapse.value);
    };
    onMounted(async () => {
      console.log("vuex", store.state);
      console.log("onMounted is start");
    });
    return {
      ...toRefs(state),
      isNavCollapse,
      defaultActive,
      handleSelect,
      isShowCfg,
      handleShowCfg,
      redirect,
      toggleMenu,
    };
  },
});
</script>

<style lang="less" scoped>
.leftNav {
  position: fixed;
  height: calc(100% - 46px);
  top: 46px;
  background: #fff;
  z-index: 1;
  display: flex;
  .menuMain {
    width: 65px;
    border-right: 1px solid #eee;
  }
  .menuMain.is_alive {
    width: 240px;
  }
  .el-menu-vertical {
    height: calc(100% - 45px);
    border-bottom: 1px solid #eee;
    overflow: auto;
  }
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 240px;
  }
  .popButton {
    cursor: pointer;
  }
  .menuCfg {
    width: 0px;
    background: #fff;
    overflow: hidden;
  }
  .menuMain {
    width: 65px;
    border-right: 1px solid #eee;
  }
  .menuMain.is_alive {
    width: 240px;
  }
  .close button {
    -moz-transition: all 0.3s linear;
    -webkit-transition: all 0.3s linear;
    transition: all 0.3s linear;
    display: none;
  }
  .bottomBtnWrap {
    height: 45px;
    line-height: 45px;
    padding: 0 15px;
    overflow: hidden;
    /* border-right: 1px solid #eee; */
    color: #777;
    margin: 0 !important;
    .el-icon-s-tools {
      margin-right: 10px;
      font-size: 16px;
      vertical-align: text-bottom;
    }

    .close {
      -moz-transition: all 0.3s linear;
      -webkit-transition: all 0.3s linear;
      transition: all 0.3s linear;
    }
    .el-icon-d-arrow-left,
    .el-icon-d-arrow-right {
      float: right;
      margin-top: 11px;
      font-size: 20px;
      cursor: pointer;
    }
    .close i {
      -moz-transition: all 0.3s linear;
      -webkit-transition: all 0.3s linear;
      transition: all 0.3s linear;
      display: block;
      width: 100%;
      line-height: 40px;
      margin-top: 0;
      text-align: center;
    }
  }
  .navCollapse {
    width: 240px;
  }
  .el-menu {
    border-right: none;
    height: calc(100vh - 45px - 46px);
  }
  .iconfont {
    font-size: 24px;
    margin-right: 10px;
  }
}

.el-menu.el-menu-vertical {
  height: calc(100% - 45px);
  border-bottom: 1px solid #eee;
  overflow: auto;
}
.el-menu.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
}
</style>
