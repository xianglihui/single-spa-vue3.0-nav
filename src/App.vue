<template>
  <nav-header v-if="isHideMenu"></nav-header>
  <router-view />
</template>
<script lang="ts">
import { reactive, toRefs } from "vue";
import NavHeader from "@/components/NavHeader.vue";
export default {
  components: {
    NavHeader,
  },
  setup() {
    const state = reactive({
      isHideMen: false,
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
</style>
