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
  prem: {};
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
  navIndex: sessionStorage.getItem("NavIndex") || 0,
  isTopCollapse: false,
  isNavCollapse: false,
  isShowCfg: false,
  crumbs: "",
  curMenu: "",
  userInfo: sessionStorage.getItem("userinfo")
    ? JSON.parse(sessionStorage.getItem("userinfo") || "{}")
    : {},
  prem: {},
  premMenu: [],
  Menus: sessionStorage.getItem("lsd-menus")
    ? JSON.parse(sessionStorage.getItem("lsd-menus") || "[]")
    : [],
  companyInfo: sessionStorage.getItem("companyinfo")
    ? JSON.parse(sessionStorage.getItem("companyinfo") || "{}")
    : "",
  isLogin: sessionStorage.getItem("userinfo") ? true : false,
};
const copyState = deepClone(state); // 拷贝state对象
function deepClone(obj: any) {
  const newObj: Record<string, unknown> | any = obj instanceof Array ? [] : {};
  for (var i in obj) {
    newObj[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
  }
  return newObj;
}

// getters
const getters: any = {
  navIndex: (st: Record<string, unknown>) => {
    return st["navIndex"];
  },
  getIsShowCfg: (st: Record<string, unknown>) => {
    return st["isShowCfg"];
  },
  getNavCollapse: (st: Record<string, unknown>) => {
    return st["isNavCollapse"];
  },
  getTopCollapse: (st: Record<string, unknown>) => {
    return st["isTopCollapse"];
  },
  getCrumbs: (st: Record<string, unknown>) => {
    return st["crumbs"];
  },
  getCurMenu: (st: Record<string, unknown>) => {
    return st["curMenu"];
  },
  getUserInfo: (st: Record<string, unknown>) => {
    return st["userInfo"];
  },
  prem: (st: Record<string, unknown>) => {
    return st["prem"];
  },
  premMenu: (st: Record<string, unknown>) => {
    return st["premMenu"];
  },
  Menus: (st: Record<string, unknown>) => {
    return st["Menus"];
  },
  companyInfo: (st: Record<string, unknown>) => {
    return st["companyInfo"];
  },
  isLogin: (st: Record<string, unknown>) => {
    return st["isLogin"];
  },
  isMobile: (st: Record<string, unknown>) => {
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
  updateShowCfg(state: Record<string, unknown>, info: Record<string, unknown>) {
    state["isShowCfg"] = info["isShowCfg"];
  },
  updateTopCollapse(
    state: Record<string, unknown>,
    info: Record<string, unknown>
  ) {
    state["isTopCollapse"] = info["isTopCollapse"];
  },
  updateNavCollapse(
    state: Record<string, unknown>,
    info: Record<string, unknown>
  ) {
    state["isNavCollapse"] = info["isNavCollapse"];
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
    for (var i in copyState) {
      state[i] = copyState[i]; // 递归赋值
    }
  },
  updateIsLogin(state: Record<string, unknown>, info: Record<string, unknown>) {
    state["isLogin"] = info["isLogin"];
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
