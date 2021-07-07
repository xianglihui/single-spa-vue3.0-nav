const env: string | undefined = process.env.NODE_ENV;

enum loginType {
  domain = "域账号登录",
  account = "账号登录",
}

const AppOps: any = {
  "pa-dev.lonsid.cn": {
    name: "LONSID PA",
    title: "朗诗德PA",
    app: "PA",
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
    name: "LONSID PA",
    title: "朗诗德PA",
    app: "PA",
    isAutoLogin: false,
    isOpenNews: false,
    login: [
      {
        action: "account",
        lable: loginType.account,
      },
    ],
    isVerificationCode: true,
  },
};

console.log("location.hostname", location.hostname);
export const AppConfig: any = AppOps[location.hostname];

export const App_Name: string = AppOps[location.hostname].app; //应用名称，获取菜单

// 接口地址
export const AJAX_PATH: string =
  env === "development"
    ? "https://soa-dev.lonsid.cn/api/"
    : "https://soa.lonsid.cn/api/";

// 管理平台地址
export const WEB_PATH: string =
  env === "development" ? "https://localhost:5000" : "";

// 门户网站地址
export const OS_PATH: string =
  env === "development" ? "https://localhost:5000" : "";

// 门户网站地址
export const PORTAL_PATH: string =
  env === "development"
    ? "https://osc-test.lonsid.cn"
    : "https://osc.lonsid.cn";

// 通用服务
export const GeneralService: string =
  env === "development"
    ? "https://soa-dev.lonsid.cn/api/GeneralService"
    : "https://soa.lonsid.cn/api/GeneralService";

//  登录认证地址
export const AUTH_PATH: string =
  env === "development"
    ? "https://soa-dev.lonsid.co"
    : "https://psso.lonsid.cn";

//  自动登录认证地址
export const AUTO_AUTH_PATH: string =
  env === "development"
    ? "https://portal-test.lonsid.cn"
    : "https://cc.lonsid.cn";
// 正式环境
// https://cc.lonsid.cn/api/domainidentity/connect/token
// https://cc.lonsid.cn/api/domainidentity/connect/token
// 测试环境
// https://portal-dev.lonsid.cn/api/domainidentity/connect/token
// https://portal-dev.lonsid.cn/api/domainidentity/connect/token
// export const AUTO_AUTH_PATH: string = env === "development"? "https://portal-dev.lonsid.cn" : "https://cc.lonsid.cn:8202";
