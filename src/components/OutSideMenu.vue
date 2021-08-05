<template>
  <div id="outsideMenu">
    <div
      class="topMenu el-icon-menu"
      :title="titleTip"
      @click="collapseNavMenu"
    ></div>
    <!-- 展开总菜单：收藏菜单、当前系统菜单、外部系统菜单  -->
    <extendNav
      @collapseNavMenu="collapseNavMenu"
      :popoverData="popoverData"
    ></extendNav>
  </div>
</template>

<script lang="ts">
import {
  reactive,
  toRefs,
  onMounted,
  defineComponent,
  computed,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import extendNav from "./ExtendNav.vue";
export default defineComponent({
  components: {
    extendNav,
  },
  setup() {
    const state = reactive({
      isUpateNavCollapse: false,
      titleTip: "",
    });
    const store = useStore();
    const route = useRoute();
    // 总菜单显示/隐藏
    const visible = computed(() => {
      return store.getters.getTopCollapse;
    });
    // 菜单
    const popoverData = computed(() => {
      return store.getters.Menus;
    });
    // 权限
    const prem = computed(() => {
      return store.getters.prem;
    });
    // 权限菜单
    const premMenu = computed(() => {
      return store.getters.premMenu;
    });
    // nav状态
    const isNavCollapse = computed(() => {
      return store.getters.getNavCollapse;
    });
    // watch 菜单
    watch(
      () => popoverData,
      (newval, oldval) => {
        console.log("newval", newval);
        console.log("oldval", oldval);
      }
    );
    watch(
      () => prem,
      (newval, oldval) => {
        console.log("newval", newval);
        console.log("oldval", oldval);
      }
    );
    const collapseNavMenu = () => {
      console.log('触发触发collapseNavMenu')
      console.log("store", store.state);
      store.commit("updateTopCollapse", !visible.value);
      if (visible.value) {
        // 关闭设置中心
        store.commit("updateShowCfg", { isShowCfg: false });
        if (isNavCollapse.value) {
          state.isUpateNavCollapse = true;
          store.commit("updateNavCollapse", { isNavCollapse: false });
        }
        state.titleTip = "显示导航窗口";
      } else {
        if (state.isUpateNavCollapse) {
          state.isUpateNavCollapse = false;
          store.commit("updateNavCollapse", { isNavCollapse: true });
        }
        state.titleTip = "隐藏导航窗口";
      }
    };
    onMounted(async () => {
      console.log("vuex outsideMenu", store.state);
      console.log("visible", visible.value);
      console.log("onMounted is start");
    });
    return {
      ...toRefs(state),
      collapseNavMenu,
    };
  },
});
</script>
<style scoped>
#outsideMenu {
  height: 45px;
  float: left;
}
#outsideMenu .topMenu {
  height: 45px;
  width: 66px;
  line-height: 41px;
  text-align: center;
  color: #0077d6;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  font-size: 24px;
}
.popoverWrap li {
  width: 80px;
  height: 90px;
  text-align: center;
  cursor: pointer;
  float: left;
}
.popoverWrap li.active {
  color: #0077d6;
}
.popoverWrap li .iconfont {
  font-size: 30px;
  color: #999;
}
.popoverWrap li.active .iconfont:before {
  color: #0077d6;
}
.popoverWrap li span {
  display: block;
}
.popoverWrap.outside {
  width: 160px;
  float: left;
  padding-left: 12px;
}
.popoverWrap.inside {
  width: 240px;
  float: left;
  padding-right: 12px;
  border-right: 1px solid #eee;
}
.popover {
  position: relative;
  /* width: 344px; */
  overflow: hidden;
}
.popover #line {
  position: absolute;
  height: 100%;
  width: 1px;
  top: 0;
  left: 172px;
  bottom: 0;
  background: #eee;
}
</style>
