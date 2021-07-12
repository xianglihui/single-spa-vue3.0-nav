const env: string | undefined = process.env.NODE_ENV;

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
    name: "localhost",
    title: "LocalHost",
    app: "A",
    isAutoLogin: false,
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

console.log("location.hostname", location.hostname);
export const AppConfig: any = AppOps[location.hostname];

export const App_Name: string = AppOps[location.hostname].app; //应用名称，获取菜单

// 接口地址
export const AJAX_PATH: string =
  env === "development" ? "http://localhost:3001" : "http://soa.lonsid.cn/api/";

// 管理平台地址
export const WEB_PATH: string =
  env === "development" ? "http://localhost:5000" : "";

// 门户网站地址
export const OS_PATH: string =
  env === "development" ? "http://localhost:3001" : "";

// 门户网站地址
export const PORTAL_PATH: string =
  env === "development" ? "http://localhost:3001" : "";

// 通用服务
export const GeneralService: string =
  env === "development" ? "http://localhost:3001" : "";

//  登录认证地址
export const AUTH_PATH: string =
  env === "development" ? "http://localhost:3001" : "";

//  自动登录认证地址
export const AUTO_AUTH_PATH: string =
  env === "development" ? "http://localhost:3001" : "";
