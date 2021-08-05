<template>
  <div class="leftNav">
    <!-- collapse 是否水平折叠收起菜单 -->
    <div>
      <el-menu
        class="el-menu-vertical"
        :default-active="0"
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
      Menus: store.getters.Menus,
      curCrumbsDictLabel: "",
      crumbsDict: {} as CommonAnyObject,
    });
    console.log("state.Menus", state.Menus);
    const defaultActive = ref("");
    const isNavCollapse = ref(store.getters.getNavCollapse); //是否水平折叠
    const navIndex = ref(store.getters.navIndex);
    const isShowCfg = ref(""); // 系统设置弹出层
    const menuPath = ref(""); // 用户选择menu时的下标
    // const curCrumbsDictLabel = ref("");
    const handleSelect = (key: string, keyPath: string) => {
      menuPath.value = key;
      sessionStorage.setItem("menuPath", key);
      localStorage.setItem("menuPath", key);
    };
    // 当前激活菜单的 index
    const getDefaultActive = () => {
      defaultActive.value = isShowCfg.value
        ? "0"
        : sessionStorage.getItem("menuPath") || "0";
    };
    // vuex中拿菜单
    const getCurMenuData = () => {
      getDefaultActive(); //获取当前选中index
      console.log("激活getCurMenuData", state.Menus);
      if (state.Menus.length == 0) {
        return [];
      } else {
        // 1、总菜单选择label跳转时，返回当前跳转的菜单
        return state.Menus[navIndex.value].subMenu;
      }
    };
    // 总菜单
    const TotalMenu = computed(() => {
      return store.getters.Menus;
    });
    /**
     * 监听所有菜单
     * Menus immediate 配置非惰性，进入触发
     *用户刷新浏览器菜单状态会发生改变，由于是所有菜单，所以切换系统/label时不会触发
     */
    watch(
      state.Menus,
      () => {
        state.curMenuData = getCurMenuData();
        console.log("watch监听state.Menus", state.curMenuData);
        /**
         * 防止single-spa环境下 用户刷新页面 nav重置
         * 目前方案有二：
         * 1、往localstorage中打标记，拿到当前菜单的index，刷新后去筛选拿到nav
         * 2、刷新页面时，获取当前页面参数，截取url，再匹配
         */
        // 当前路由
        const curUrl = "/" + route.path.split(/\//)[1];
        console.log("---curUrl---", curUrl);
        console.log("TotalMenu", TotalMenu.value);
        console.log("state.curMenuData", state.curMenuData);
      },
      { immediate: true }
    );
    /**
     * 监听route
     * 菜单label切换时,包括切换系统时路由都会发生变化，更新当前菜单，刷新页面不会发生触发
     */
    watch(route, async () => {
      console.log("navaside激活route");
      state.curMenuData = getCurMenuData();
      console.log("state.curMenuData", state.curMenuData);
    });
    // 点击菜单
    const redirect = (item: any) => {
      console.log("---获取总菜单---", state.Menus);
      if (item.path) {
        // this.createCrumbs()
        // this.createCrumbsDict(this.menuData, "")
        let curPath: string = route.path + location.search;
        state.curCrumbsDictLabel = state.crumbsDict[curPath];
        // 面包屑
        store.commit("updateCrumbs", {
          crumbs: state.curCrumbsDictLabel,
        });
        // if (item.isCollapse) {
        //   this.toggleMenu();
        // }

        // const currentPaths = ((route.query as any).from || "").split("/");
        // const navPaths = item.path.split("/");
        // state.isResetNavIndex = currentPaths[1] == navPaths[1] ? true : false;

        // if (state.isShowCfg) {
        //   this.handleShowCfg();
        // }

        sessionStorage.setItem("NavIndex", navIndex.value);
        localStorage.setItem("NavIndex", navIndex.value);
        // 关闭菜单
        // store.commit("updateTopCollapse", { isTopCollapse: false });
        router.push(item.path);
      }
    };
    onMounted(async () => {
      console.log("vuex", store.state);
      console.log("onMounted is start");
    });
    return {
      ...toRefs(state),
      isNavCollapse,
      handleSelect,
      redirect,
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
  .el-menu-vertical {
    height: calc(100% - 45px);
    border-bottom: 1px solid #eee;
    overflow: auto;
  }
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 240px;
  }
}
</style>
