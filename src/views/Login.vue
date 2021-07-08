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
import { AutoAuthorization, Authorization } from "@/utils/authorization";
import { AUTO_AUTH_PATH, AppConfig } from "@/utils/env";
import { ElMessage } from 'element-plus'
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
    const submitForm = () => {
      state.loginForm.validate(async (valid: boolean) => {
        if (valid) {
          // const loading = this.$loading({ lock: true });
          state.loginForm.grant_type = "password";
          state.loginForm.client_id = "Portal";
          state.loginForm.client_secret =
            "4b0e4e4c-a86e-4759-ad08-b9ea0558aa6d";
          state.loginForm.scope = "PortalAPI offline_access";

          // if (this.isVerificationCode) {
          //   console.log(msg);
          //   if (msg["codeMsg"]) {
          //     this.loginForm.phoneVerificationCode = msg["codeMsg"];
          //     this.loginForm.imageVerficationToken = undefined;
          //     this.loginForm.imageVerficationCode = undefined;
          //   } else {
          //     this.loginForm.imageVerficationToken = this.imageCodeRes.token;
          //   }
          // } else {
          //   this.loginForm.clientKey = "D07108DD991071C9";
          // }

          await login();
          // loading.close();
        } else {
          return false;
        }
        console.log("state", state.loginForm);
      });
    };
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
    const login = async () => {
      let res: Models.AuthRes = {};
      // 自动登录
      await Authorization(state.loginForm).then(async (res: Models.AuthRes) => {
        // await this.saveToken(res.access_token || "");
      });
      // .catch((res) => {
      //   this.getImgCode();
      //   if (
      //     res.response.data &&
      //     res.response.data.error_description ===
      //       "RequiredPhoneVerificationCode"
      //   ) {
      //     this.mobile = res.response.data["phone"];
      //     this.dialogVisiabled = true;
      //   }
      // });
      return true;
    };
    onMounted(async () => {
      console.log("Component is mounted!");
      // test();
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
  background-image: url(//iot.lonsid.cn/img/signin_bg.png);
  background-repeat: no-repeat;
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
