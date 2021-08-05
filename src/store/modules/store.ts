import { AppConfig } from "@/utils/env";
export interface State {
  isMobile: boolean;
  navIndex: string | number;
  isTopCollapse: boolean;
  isNavCollapse: boolean;
  isShowCfg: boolean;
  crumbs: string;
  curMenu: string;
  userInfo: any;
  prem: Record<string, unknown>;
  premMenu: never[];
  Menus: any;
  companyInfo: any;
  isLogin: boolean;
}

if (AppConfig.isOpenNews) {
  sessionStorage.setItem(
    "premission",
    localStorage.getItem("premission") || ""
  );
  sessionStorage.setItem(
    "userAccount",
    localStorage.getItem("userAccount") || ""
  );
  sessionStorage.setItem("userinfo", localStorage.getItem("userinfo") || "");
  sessionStorage.setItem("token", localStorage.getItem("token") || "");
  sessionStorage.setItem("menuPath", localStorage.getItem("menuPath") || "");
  sessionStorage.setItem("NavIndex", localStorage.getItem("NavIndex") || "");
}

const state = {
  isMobile: /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent),
  navIndex: sessionStorage.getItem("NavIndex") || 0, //当前菜单标记
  isTopCollapse: false, // 总菜单开关
  isNavCollapse: false, // 菜单开关
  isShowCfg: false, // 控制开关
  crumbs: "", // 面包屑
  curMenu: "", // 当前菜单
  userInfo: sessionStorage.getItem("userinfo")
    ? JSON.parse(sessionStorage.getItem("userinfo") || "{}")
    : {}, // 用户信息
  prem: {}, // 权限
  premMenu: [], // 权限菜单
  Menus: sessionStorage.getItem("lsd-menus")
    ? JSON.parse(sessionStorage.getItem("lsd-menus") || "[]")
    : [], //菜单
  companyInfo: sessionStorage.getItem("companyinfo")
    ? JSON.parse(sessionStorage.getItem("companyinfo") || "{}")
    : "",
  isLogin: sessionStorage.getItem("userinfo") ? true : false, //登录状态
};
const copyState = deepClone(state); // 拷贝state对象
function deepClone(obj: any) {
  const newObj: Record<string, unknown> | any = obj instanceof Array ? [] : {};
  for (const i in obj) {
    newObj[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
  }
  return newObj;
}

// getters
const getters: any = {
  navIndex: (st: State) => {
    return st["navIndex"];
  },
  getIsShowCfg: (st: State) => {
    return st["isShowCfg"];
  },
  getNavCollapse: (st: State) => {
    return st["isNavCollapse"];
  },
  getTopCollapse: (st: State) => {
    return st["isTopCollapse"];
  },
  getCrumbs: (st: State) => {
    return st["crumbs"];
  },
  getCurMenu: (st: State) => {
    return st["curMenu"];
  },
  getUserInfo: (st: State) => {
    return st["userInfo"];
  },
  prem: (st: State) => {
    return st["prem"];
  },
  premMenu: (st: State) => {
    return st["premMenu"];
  },
  Menus: (st: State) => {
    return st["Menus"];
  },
  companyInfo: (st: State) => {
    return st["companyInfo"];
  },
  isLogin: (st: State) => {
    return st["isLogin"];
  },
  isMobile: (st: State) => {
    return st["isMobile"];
  },
};

const actions: any = {
  // asyncUpdateUserInfo(context: any, info: Record<string, unknown>) {
  //     context.commit("updateUserInfo", info)
  // }
};

const mutations: any = {
  updateNavIndex(state: Record<string, unknown>, info: string | number) {
    state["navIndex"] = info;
  },
  updateShowCfg(state: Record<string, unknown>, info: boolean) {
    state["isShowCfg"] = info;
  },
  updateTopCollapse(state: Record<string, unknown>, info: boolean) {
    state["isTopCollapse"] = info;
  },
  updateNavCollapse(state: Record<string, unknown>, info: boolean) {
    state["isNavCollapse"] = info;
  },
  updateCrumbs(state: Record<string, unknown>, info: Record<string, unknown>) {
    state["crumbs"] = info["crumbs"];
  },
  updateCurMenu(state: Record<string, unknown>, info: Record<string, unknown>) {
    state["curMenu"] = info["curMenu"];
  },
  updateUserInfo(
    state: Record<string, unknown>,
    info: Record<string, unknown>
  ) {
    state["userInfo"] = info["userInfo"];
  },
  updatePrem(state: Record<string, unknown>, info: Record<string, unknown>) {
    state["prem"] = info["prem"];
  },
  updatePremMenu(
    state: Record<string, unknown>,
    info: Record<string, unknown>
  ) {
    state["premMenu"] = info["premMenu"];
  },
  updateMenus(state: Record<string, unknown>, info: Record<string, unknown>) {
    state["Menus"] = info["Menus"];
  },
  updateCompanyInfo(
    state: Record<string, unknown>,
    info: Record<string, unknown>
  ) {
    state["companyInfo"] = info["companyInfo"];
  },
  resetState(state: any) {
    console.log("重置State", copyState);
    for (const i in copyState) {
      state[i] = copyState[i]; // 递归赋值
    }
  },
  updateIsLogin(state: State, info: State) {
    console.log("updateIsLogin", info);
    state["isLogin"] = info["isLogin"]; // 登录状态
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
