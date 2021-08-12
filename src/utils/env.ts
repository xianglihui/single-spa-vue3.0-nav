interface Tenv {
  development?: string;
  local?: string;
  production?: string;
}
const env: string = process.env.NODE_ENV || "";
console.log("env", process.env.NODE_ENV);
// type Tenv = () => string;
// const env: Tenv = () => {
//   return process.env.NODE_ENV || "";
// };
export enum Eenv {
  development = "development",
  local = "local",
  production = "production",
}
enum loginType {
  domain = "域账号登录",
  account = "账号登录",
}

const AppOps: any = {
  "localhost:3000": {
    name: "localA",
    title: "localA",
    app: "A",
    isAutoLogin: true,
    isOpenNews: true,
    login: [
      {
        action: "domain",
        lable: loginType.domain,
      },
    ], // account：账号登录   domain： 域账号登录
  },
  localhost: {
    name: "CentralSystem",
    title: "CentralSystem",
    app: "center",
    isAutoLogin: true, //域账号自动登录
    isOpenNews: false,
    login: [
      {
        action: "account",
        lable: loginType.account,
      },
    ],
    isVerificationCode: true, // 是否需要验证码
  },
};
/**
 * 设置或返回当前 URL 的主机名。
 * 根据当前URL匹配访问的系统
 */
export const AppConfig: any = AppOps[location.hostname];
console.log("AppConfig", AppConfig);

export const App_Name: string = AppOps[location.hostname].app; //应用名称，获取菜单
// 接口地址
export const AJAX_PATH: string =
  env === "development" ? "http://localhost:3001" : "";

//  登录认证地址
export const AUTH_PATH: string =
  env === "development" ? "http://localhost:3001" : "";

//  自动登录认证地址
export const AUTO_AUTH_PATH: string =
  env === "development" ? "http://localhost:3001" : "";

export { env };
