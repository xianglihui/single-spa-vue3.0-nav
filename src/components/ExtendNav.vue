<template>
  <div
    class="lsd-nav-r"
    :style="{ width: `${visible ? `calc(100% - ${leftWidth}px)` : '0px'}` }"
  >
    <div class="lsd-nav-r-wrap" :style="{ width: `${visible ? 1200 : 0}px` }">
      <el-row :style="{ padding: '50px 30px 30px 30px' }">
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
            <!-- 菜单 s -->
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
                      ></i
                      >{{ item.name }}
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
            <!-- 菜单 e -->
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 遮罩层 -->
    <div class="lsd-nav-msk" @click="collapseNavMenu"></div>
  </div>
</template>

<script lang="ts">
import {
  reactive,
  toRefs,
  onMounted,
  defineComponent,
  computed,
  watchEffect,
} from "vue";
import { GetUserFavoriteFeature } from "@/utils/authorization";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();
    const visible = computed(() => {
      return store.getters.getTopCollapse;
    });
    const state = reactive({
      leftWidth: 240,
      collectionMenuData: [],
      menuData: [],
      visible,
    });
    // 每3个一组分割导航数据
    const menus = computed(() => {
      const menuArr: any = [];
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
    // 获取菜单数据
    const getMenuData = computed(() => {
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
    //
    const collectionMenu = () => {
      console.log("collectionMenu");
    };
    // 取消收藏
    const cancelCollection = () => {
      console.log("取消收藏");
    };
    return {
      ...toRefs(state),
      getCollection,
      collectionMenu,
      cancelCollection,
      handleCollection,
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
