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
            <el-form-item label="账号" prop="username">
              <el-input
                v-model="loginForm.username"
                @keyup.enter="submitForm"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                type="password"
                v-model="loginForm.password"
                @keyup.enter="submitForm"
              ></el-input>
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
import { reactive, toRefs, onMounted, ref } from "vue";
import {
  AutoAuthorization,
  Authorization,
  GetMenuItems,
} from "@/utils/authorization";
import { AUTO_AUTH_PATH, AppConfig } from "@/utils/env";
import { useRoute } from "vue-router";
import { ElLoading, ElMessage } from "element-plus";
import * as API from "@/api";
export default {
  setup() {
    const state = reactive({
      loginForm: {
        username: "",
        password: "",
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
      logins: AppConfig.login || [],
      title: AppConfig.title || "",
      token: "",
    });
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
    // 提交
    const submitForm = () => {
      state.loginForm.validate(async (valid: boolean) => {
        if (valid) {
          // const loading = this.$loading({ lock: true });
          state.loginForm.grant_type = "password";
          state.loginForm.client_id = "Portal";
          state.loginForm.client_secret =
            "4b0e4e4c-a86e-4759-ad08-b9ea0558aa6d";
          state.loginForm.scope = "PortalAPI offline_access";
          await login();
          // loading.close();
        } else {
          return false;
        }
        console.log("state", state.loginForm);
      });
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
      console.log("state", state.loginForm);
    };
    // 登录
    const login = async () => {
      let res: Models.AuthRes = {};
      // 自动登录
      await Authorization(state.loginForm).then(async (res: Models.AuthRes) => {
        // await this.saveToken(res.access_token || "");
      });
      return true;
    };
    const init = () => {
      loginToken();
    };
    // 用户权限
    const getPremission = () => {
      console.log('用户权限')
    };
    // 用户信息
    const getUserInfo = () => {
      console.log('用户信息')
    };
    const saveToken = async (token: string) => {
      ElMessage({
        message: "登录成功",
        type: "success",
        duration: 1000,
        onClose: async () => {
          localStorage.setItem("token", token);
          sessionStorage.setItem("token", token);
          getPremission();
          getUserInfo();
          localStorage.setItem("userAccount", state.loginForm.username);
          sessionStorage.setItem("userAccount", state.loginForm.username);
          const menus = await GetMenuItems();
        },
      });
    };
    // 获取token 首先获取token用户submit时校验
    const loginToken = async () => {
      try {
        const res = await API.LoginToken.request();
        // state.token = res.token;
        // }
      } catch (error) {
        console.log(error)
      }
    };
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
    };
  },
};
</script>
<style lang="less" scoped>
.login {
  width: 100%;
  height: 100vh;
  // background-image: url();
  // background-repeat: no-repeat;
  background-size: cover;
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
