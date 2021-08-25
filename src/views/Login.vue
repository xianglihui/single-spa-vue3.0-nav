<template>
  <div class="login">
    <div class="login-bg">
      <div class="logo"></div>
      <div class="login-form">
        <div class="loginForm_title">{{ title }}平台登录</div>
        <div class="loginForm_body">
          <el-form
            :model="loginForm"
            :rules="rules"
            label-width="70px"
            class="ruleForm"
          >
            <el-form-item label="账号">
              <el-input
                v-model="loginForm.username"
                @keyup.enter="submitForm"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input
                type="password"
                v-model="loginForm.password"
                @keyup.enter="submitForm"
              ></el-input>
            </el-form-item>
            <!--isVerificationCode判断是否需要验证码  -->
            <el-form-item
              label="验证码"
              prop="imageVerficationCode"
              v-if="isVerificationCode"
            >
              <el-input
                class="code"
                type="text"
                v-model="loginForm.imageVerficationCode"
                @keyup.enter="submitForm"
              ></el-input>
              <img
                :src="imageCodeRes.imageBase64"
                alt=""
                class="code-img"
                @click="getImgCode"
              />
            </el-form-item>
            <el-form-item
              v-for="(item, key) in logins"
              :key="key"
              style="margin-bottom: 0px"
            >
              <el-button type="primary" @click="submitLogin(item.action)">{{
                item.lable
              }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as Models from "@/models/Models";
import { reactive, toRefs, onMounted, ref, defineComponent } from "vue";
import {
  AutoAuthorization,
  Authorization,
  GetMenuItems,
  Premission,
  userInfo,
} from "@/utils/authorization";
import { AUTO_AUTH_PATH, AppConfig } from "@/utils/env";
import { useRoute, useRouter } from "vue-router";
import { ElLoading, ElMessage } from "element-plus";
import * as API from "@/api";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const state = reactive({
      loginForm: {
        // username: "",
        // password: "",
      } as Models.AuthReq,
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "change",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "change",
          },
        ],
      },
      logins: AppConfig.login || [], //localhost {action: "account", lable: "账号登录"}
      title: AppConfig.title || "", //header标题
      isVerificationCode: AppConfig.isVerificationCode || false, //是否需要验证码
      imageCodeRes: {
        imageBase64: "",
        token: "",
      },
      token: "",
    });
    // const val = ref(1);
    // vuex
    const store = useStore();
    const router = useRouter();
    // account账号密码登录 domain域账号登录
    const submitLogin = (type: string) => {
      switch (type) {
        case "account":
          submitForm();
          break;
        case "domain":
          domainLogin();
          break;
        default:
          ElMessage({ message: "登录方式不存在", type: "warning" });
          break;
      }
    };
    // 账号密码登录
    const submitForm = async () => {
      // state.loginForm.validate(async (valid: boolean) => {
      // if (valid) {
      const loading = ElLoading.service({ lock: true });
      state.loginForm.grant_type = "password";
      state.loginForm.client_id = "localA";
      state.loginForm.client_secret = "1";
      state.loginForm.scope = "1";

      // 验证码
      if (state.isVerificationCode) {
        state.loginForm.imageVerficationToken = state.imageCodeRes.token;
      }
      // 登录
      await login();
      loading.close();
      // } else {
      //   return false;
      // }
      // });
    };
    // 域账号登录
    const domainLogin = () => {
      state.loginForm["loginForm"].validate(async (valid: boolean) => {
        if (valid) {
          // const loading = this.$loading({ lock: true });
          state.loginForm.grant_type = "sso";
          state.loginForm.client_id = "SSO";
          state.loginForm.client_secret =
            "52454724-e1f0-45dd-9167-38b40b46a935";
          state.loginForm.scope = "PortalAPI offline_access";
          // await this.login();
          // loading.close();
        } else {
          return false;
        }
      });
    };
    // 登录
    const login = async () => {
      let res: Models.AuthRes = {};
      // 授权登录
      await Authorization(state.loginForm).then(async (res: Models.AuthRes) => {
        await saveToken(res.access_token || "");
      });
      return true;
    };
    // onMounted 初始化
    const init = () => {
      // 清理缓存
      localStorage.clear();
      sessionStorage.clear();
      // 重置vuex状态
      store.commit("resetState");
      // 重置登录状态
      store.commit("updateIsLogin", { isLogin: false });
      // 拿imgCode & token
      initToken();
    };
    // 用户权限
    const getPremission = async () => {
      sessionStorage.removeItem("prem");
      // 获取用户权限
      const res = await Premission();
      if (res.permission) {
        let prem: { [key: string]: string | number } = {};
        res.permission.map((e: string) => {
          prem[e] = 1;
        });
        sessionStorage.setItem("prem", JSON.stringify(prem));
        // store.commit("updatePrem", { prem })
      }
    };
    // 用户信息
    const getUserInfo = async () => {
      const res = await userInfo();
      // 更新用户信息
      store.commit("updateUserInfo", { userInfo: res });
    };
    // 存取信息 自动登录与授权登录公用
    const saveToken = async (token: string) => {
      ElMessage({
        message: "登录成功",
        type: "success",
        duration: 1000,
        onClose: async () => {
          // 存token
          localStorage.setItem("token", token);
          sessionStorage.setItem("token", token);
          // 权限
          await getPremission();
          // 用户信息
          await getUserInfo();
          // 存用户信息
          localStorage.setItem("userAccount", state.loginForm.username);
          sessionStorage.setItem("userAccount", state.loginForm.username);
          // 菜单
          const menus = await GetMenuItems();
          if (menus.length == 0) {
            ElMessage({
              message: "账号权限不足，请联系管理员设置权限",
              type: "error",
              duration: 3000,
            });
          } else {
            store.commit("updateMenus", { Menus: menus });
            store.commit("updateNavIndex", 0);
            store.commit("updateIsLogin", { isLogin: true });
            router.push(
              menus[0].subMenu[0].subMenu
                ? menus[0].subMenu[0].subMenu[0].path
                : menus[0].subMenu[0].path
            );
            // router.push("/h");
          }
        },
      });
    };
    // 获取token 首先获取token用户submit时校验
    const initToken = async () => {
      try {
        const res = await API.initToken.request();
        // 验证码 动态
        state.imageCodeRes.imageBase64 =
          "data:image/jpeg;base64," + res.imageBase64;
        // token 用于登录校验
        state.imageCodeRes.token = res.token;
        // state.token = res.token;
        // }
      } catch (error) {}
    };
    // 自动登录
    const autoLogin = () => {
      let res: Models.AuthRes = {};
      const loading = ElLoading.service({ lock: true, text: "自动登录..." });
      AutoAuthorization()
        .then(async (res: any) => {
          saveToken(res.access_token || "");
          loading.close();
        })
        .catch(() => {
          ElMessage({
            message: "自动登录失败",
            type: "error",
            duration: 1000,
          });
        })
        .finally(() => {
          loading.close();
        });
    };
    const route = useRoute(); // 初始化route
    onMounted(async () => {
      // 初始化
      init();
      if (AppConfig.isAutoLogin && !route.query.reLogin) {
        autoLogin();
      }
    });
    return {
      ...toRefs(state),
      submitForm,
      submitLogin,
    };
  },
});
</script>
<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  // height: 100vh;
  // background-image: url('../assets/img/bg.jpg');
  // background-repeat: no-repeat;
  // background-size: cover;
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  .login-bg {
    height: 416px;
    width: 1200px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    position: absolute;
    z-index: 2;
    .login-form {
      position: absolute;
      top: 0px;
      right: 0px;
      width: 521px;
      /* //height: 416px; */
      background-color: #fff;
      border-radius: 4px;
      border: 2px solid #1279d5;
      .loginForm_title {
        height: 123px;
        background-color: #1279d5;
        font-size: 28px;
        font-weight: 700;
        line-height: 123px;
        letter-spacing: 0;
        color: #fff;
        text-align: center;
      }
      .loginForm_body {
        padding-top: 40px;
        padding-bottom: 20px;
        .el-form {
          width: 360px;
          margin: 0 auto;
        }
        .el-form-item__label {
          color: #333;
          font-weight: 700;
          -moz-text-align-last: justify;
          text-align-last: justify;
        }
        .el-button {
          width: 100%;
        }
        .code {
          width: 180px;
        }
        .code-img {
          width: 100px;
          height: 40px;
          float: right;
        }
      }
    }
  }
}
.login::before {
  width: 100%;
  height: 171px;
  background-image: -webkit-gradient(
      linear,
      left bottom,
      left top,
      from(#1279d5),
      to(#026bc9)
    ),
    -webkit-gradient(linear, left top, left bottom, from(#0069c7), to(#0069c7));
  background-image: -o-linear-gradient(bottom, #1279d5 0, #026bc9 100%),
    -o-linear-gradient(#0069c7, #0069c7);
  background-image: linear-gradient(0deg, #1279d5, #026bc9),
    linear-gradient(#0069c7, #0069c7);
  background-blend-mode: normal, normal;
  opacity: 0.95;
  position: absolute;
}
</style>
