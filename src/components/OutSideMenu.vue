<template>
  <div id="outsideMenu">
    <!-- <div
      class="topMenu el-icon-menu"
      :title="titleTip"
      @click="collapseNavMenu"
    ></div> -->
    <!--  -->
    <!-- <extend-nav @collapseNavMenu="collapseNavMenu" :popoverData="popoverData" :popoverOutsideData="popoverOutsideData"></extend-nav> -->
  </div>
</template>

<script lang="ts">
// import { Component, Vue, Watch } from "vue-property-decorator"
// import { menuConfig, formatMenu } from "@/lib/menu"

// interface MenuData {
//     name: string
//     icon?: string
//     path?: string
//     active?: boolean
//     subMenu?: MenuData[]
//     prem?: string
//     [propertyName: string]: any
// }
// import MenuData from "@/lib/menu/models"

// import ExtendNav from "./ExtendNav.vue"

// import { GetAllModules } from "@/util/authorization"

interface Dict {
  key: string;
  list: string[];
}
// @Component({
//     components: {
//         'extend-nav': ExtendNav
//     },
// })
export default {};
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
