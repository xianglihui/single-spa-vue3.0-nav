<template>
  <div
    class="lsd-nav-r"
    :style="{ width: `${visible ? `calc(100% - ${leftWidth}px)` : '0px'}` }"
  >
    <div class="lsd-nav-r-wrap" :style="{ width: `${visible ? 1200 : 0}px` }">
      <el-row :style="{ padding: '50px 30px 30px 30px' }">
        <!-- 收藏与菜单 s -->
        <el-col :span="18">
          <div :style="{ height: 'calc( 100vh - 184px)', overflowX: 'auto' }">
            <!-- 我的收藏 s -->
            <div v-show="collectionMenuData.length > 0">
              <dl class="lsd-nav-r-wrap-l-dl">
                <el-row>
                  <dd><h3>我的收藏</h3></dd>
                  <el-col
                    :span="8"
                    class="lsd-nav-r-wrap-l-dl-li"
                    v-for="(val, key) in collectionMenuData"
                    :key="key"
                  >
                    <a href="javascript:;;">
                      <span @click="collectionMenu(val)">{{
                        val.featureName
                      }}</span>
                      <i
                        class="el-icon-close"
                        @click="cancelCollection(val.featureId, false)"
                      ></i>
                    </a>
                  </el-col>
                </el-row>
              </dl>
            </div>
            <!-- 我的收藏 e -->
            <!-- 当前系统菜单 s -->
            <el-row v-for="(values, k) in menus" :key="k">
              <el-col :span="8" v-for="(item, index) in values" :key="index">
                <dl class="lsd-nav-r-wrap-l-dl">
                  <dd>
                    <h3>
                      <i
                        :class="`iconfont ${item.icon}`"
                        :style="{
                          fontSize: '14px',
                          marginRight: '5px',
                          color: '#3c3c3c',
                        }"
                      ></i>
                      {{ item.name }}
                    </h3>
                  </dd>
                  <el-row>
                    <el-col
                      class="lsd-nav-r-wrap-l-dl-li"
                      v-for="(val, key) in item.subMenu"
                      :key="key"
                    >
                      <a href="javascript:;;">
                        <span
                          @click="
                            menuChange(
                              val,
                              `${!val.subMenu ? key : key + '-0'}`,
                              item.name,
                              k * 3 + index,
                              item.prem
                            )
                          "
                          >{{ val.name }}</span
                        >
                        <i
                          :class="[
                            val.isCollection
                              ? 'el-icon-star-on'
                              : 'el-icon-star-off',
                          ]"
                          :style="{
                            color: val.isCollection
                              ? 'red'
                              : 'rgb(126, 140, 141)',
                            visibility: val.isCollection ? 'inherit' : '',
                          }"
                          @click="handleCollection(val.id, !val.isCollection)"
                        ></i>
                      </a>
                    </el-col>
                  </el-row>
                </dl>
              </el-col>
            </el-row>
            <!-- 当前系统菜单 e -->
          </div>
        </el-col>
        <!-- 收藏与菜单 e -->
        <!-- 各外部系统集合 s -->
        <el-col :span="6">
          <div :style="{ padding: '20px 0 20px 20px' }">
            <el-row v-if="!isShowOutMuens">
              <el-col
                :span="8"
                v-for="(item, index) in popoverOutsideData"
                :key="index"
                v-show="item.featureType === 1"
                :style="{ textAlign: 'center', marginBottom: '20px' }"
              >
                <el-link :underline="false" target="_blank" :href="item.url">
                  <i
                    :class="`iconfont ${item.icon}`"
                    :style="{ fontSize: '30px', color: 'rgb(96, 98, 102)' }"
                  ></i>
                  <p
                    :style="{
                      fontSize: '14px',
                      color: 'rgb(96, 98, 102)',
                      marginTop: '5px',
                    }"
                  >
                    {{ item.name }}
                  </p>
                </el-link>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <!-- 各外部系统集合 e -->
      </el-row>
    </div>
    <!-- 遮罩层 -->
    <div class="lsd-nav-msk" @click="collapseNavMenu"></div>
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

import {
  reactive,
  toRefs,
  onMounted,
  defineComponent,
  computed,
  watchEffect,
} from "vue";
import { GetUserFavoriteFeature, GetAllModules } from "@/utils/authorization";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
  setup(props, context) {
    const parent = { ...context };
    const store = useStore();
    // 用vuex控制开关
    const visible = computed(() => {
      return store.getters.getTopCollapse;
    });
    const router = useRouter();
    const state = reactive({
      leftWidth: 240, // 展开的宽度
      collectionMenuData: [], // 收藏
      popoverOutsideData: [], // 外部系统
      menuData: [] as Array<MenuData>, // 总菜单
      visible, // 开关
    });
    // 每3个一组分割导航数据
    const menus = computed(() => {
      const menuArr: any = [];
      console.log("state.menuData", state.menuData);
      for (let i = 0; i < state.menuData.length; i += 3) {
        menuArr.push(
          state.menuData.slice(i, i + 3).map((item: any) => {
            return {
              ...item,
              subMenu: item.subMenu.map((v: any) => {
                return {
                  ...v,
                  isCollection: state.collectionMenuData.find((val: any) => {
                    return val.featureId == v.id;
                  })
                    ? true
                    : false,
                };
              }),
            };
          })
        );
      }
      return menuArr;
    });
    // 获取总菜单数据
    const getMenuData = computed(() => {
      // console.log("store.getters.Menus", store.getters.Menus);
      return store.getters.Menus;
    });
    watchEffect(() => {
      state.menuData = getMenuData.value;
    });
    // 获取收藏菜单数据
    const getCollection = () => {
      GetUserFavoriteFeature().then((res) => {
        console.log("res", res);
      });
    };
    // 收藏菜单
    const handleCollection = () => {
      console.log("收藏");
    };
    // 收藏
    const collectionMenu = () => {
      console.log("collectionMenu");
    };
    // 取消收藏
    const cancelCollection = () => {
      console.log("取消收藏");
    };
    // 项目跳转
    const menuChange = (
      e: MenuData,
      index: string,
      name: string,
      k: number,
      prem: string
    ) => {
      console.log("state.menuData", state.menuData);
      const _path = e.path || (e.subMenu as any)[0].path || "";
      console.log("_path", _path);
      store.commit("updateCurMenu", { curMenu: { name: name } });
      // 根据code返回（下标）锚点 name也可以，只是为了获取锚点，也就是获取用户访问的系统
      const navIndex = state.menuData.findIndex((v: any) => {
        return v.prem === prem;
      });
      console.log("navIndex", navIndex);
      // 当前菜单的锚点
      const menuIndex = (state.menuData[navIndex].subMenu as any).findIndex(
        (v: any) => {
          return v.prem === e.prem;
        }
      );
      sessionStorage.setItem("menuPath", e.path ? menuIndex : `${menuIndex}-0`);
      localStorage.setItem("menuPath", e.path ? menuIndex : `${menuIndex}-0`);
      router.push(_path);
      collapseNavMenu();
    };
    // 获取外部菜单
    const getOutSideMenu = () => {
      console.log("调用");
      GetAllModules().then((res: any) => {
        console.log("获取外部菜单", res);
        state.popoverOutsideData = res;
      });
    };
    // 关闭遮罩层
    const collapseNavMenu = () => {
      console.log("关闭遮罩层");
      parent.emit("collapseNavMenu");
    };
    onMounted(() => {
      getOutSideMenu();
      // console.log("menus", menus.value);
    });
    return {
      ...toRefs(state),
      getCollection,
      collectionMenu,
      cancelCollection,
      handleCollection,
      menuChange,
      collapseNavMenu,
      menus,
    };
  },
});
</script>

<style lang="less">
.lsd-nav-r {
  position: fixed;
  height: calc(100vh - 46px);
  bottom: 0px;
  right: 0px;
  overflow: hidden;
  .lsd-nav-msk {
    position: absolute;
    z-index: 900;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
  .lsd-nav-r-wrap {
    position: absolute;
    z-index: 999;
    width: 0px;
    height: 100%;
    background: #fff;
    border-left: 1px solid #eaeaea;
    transition: all 0.3s linear;
    border: 1rpx solid pink;
    .lsd-nav-r-wrap-l-dl {
      margin-bottom: 20px;
      h3 {
        font-size: 14px;
        line-height: 32px;
        height: 32px;
        font-weight: 600;
        padding-left: 10px;
      }
      .lsd-nav-r-wrap-l-dl-li {
        height: 32px;
        font-size: 14px;
        color: rgb(85, 85, 85);
        position: relative;
        a {
          display: flex;
          padding-left: 10px;
          margin-right: 15px;
          height: 100%;
          line-height: 32px;
          transition: all 300ms ease 0s;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>
