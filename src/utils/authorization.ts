import { AUTO_AUTH_PATH, AUTH_PATH, App_Name } from "@/utils/env";
import axios from "axios";
import * as Models from "@/models/Models";
import { HttpResource, HttpMethod } from "@/utils/http";

interface MenuData {
  name: string;
  icon?: string;
  path?: string;
  subMenu?: MenuData[];
  active?: boolean;
  prem?: string;
  [propertyName: string]: any;
}

// 自动登录(域账号)
export async function AutoAuthorization() {
  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  const autoLoginURL = AUTO_AUTH_PATH + "/token";
  return await axios.post(autoLoginURL, null, config).then((res) => res.data);
}
// 登录
export async function Authorization(options: Models.AuthReq) {
  let params = "";
  const property = "";
  for (const property in options) {
    if (options[property]) {
      params += `&${property}=${options[property]}`;
    }
  }
  params = params.substring(1, params.length);
  const serve = new HttpResource<Models.AuthRes>(
    HttpMethod.Get,
    AUTH_PATH + "/authorization"
  );
  const res = await serve.request(params);
  if (res.access_token) {
    const saveTime: Date = new Date();
    sessionStorage.setItem("saveTime", String(saveTime.getTime()));
    sessionStorage.setItem("saveOpts", JSON.stringify(options));
    return res;
  } else {
    return {};
  }
}
// 权限
export async function Premission() {
  const serve = new HttpResource<Models.Premissions>(
    HttpMethod.Get,
    AUTH_PATH + "/getPermissions"
  );
  const res = await serve.request();
  console.log("权限", res);
  const jstr = JSON.stringify(res.permission);
  localStorage.setItem("premission", jstr);
  sessionStorage.setItem("premission", jstr);
  return res;
}
type Menu = {
  active: boolean;
  icon: string;
  name: string;
  prem: string;
  path: string;
  featureType: string;
  pinyin: string;
  id: string;
  isCollapse: boolean;
};
let configMenus: Menu[] = [];
// 获取菜单
export async function GetMenuItems() {
  let res: any = false; // localStorage.getItem('lsd-menus')
  if (res) {
    return JSON.parse(res);
  } else {
    // App_Name 根据项目名称获取不同菜单列表
    const serve = await new HttpResource<Array<MenuData>>(
      HttpMethod.Get,
      AUTH_PATH + `/getMenuTreesByUser?moduleName=${App_Name}`
    );
    console.log("run2", serve);
    res = await serve.request();
    console.log("获取菜单---------", res);
    // 菜单中的设置模块
    configMenus = [];
    if (res.length == 0) {
      return [];
    } else {
      // 拿当前系统的菜单
      const data = getNavMapMenu(res[0]["children"]);
      sessionStorage.setItem("lsd-menus", JSON.stringify(data));
      sessionStorage.setItem("lsd-config-menus", JSON.stringify(configMenus));
      return data;
    }
  }
}
// 侧边栏菜单
function getNavMapMenu(res: any) {
  console.log("getNavMapMenu", res);
  let isSubmenu = false;
  return res
    .filter((v: any) => {
      // 如果该模块属于'设置'，将设置模块独立
      if (v.featureType == 4) {
        configMenus.push({
          active: false,
          icon: v.icon,
          name: v.name,
          prem: v.code,
          path: v.url,
          featureType: v.featureType,
          pinyin: v.namePinyin || "",
          id: v.id,
          isCollapse: v.isCollapse || false,
        });
      }
      // 返回属于'菜单'的模块
      return v.featureType == 3;
    })
    .map((v: any) => {
      const data: any = {
        active: false,
        icon: v.icon,
        name: v.name,
        prem: v.code,
        path: v.url,
        featureType: v.featureType,
        pinyin: v.namePinyin || "",
        id: v.id,
        isCollapse: v.isCollapse || false,
      };
      v.children.map((val: any) => {
        if (val.featureType == 3) {
          isSubmenu = true;
        }
      });

      if (v.featureType == 3 && v.children.length > 0 && isSubmenu) {
        data.subMenu = getNavMapMenu(v.children);
      }

      return data;
    });
}
// 获取所有菜单
export async function GetAllModules() {
  const serve = new HttpResource<Array<MenuData>>(
    HttpMethod.Get,
    AUTH_PATH + "/getAllModules"
  );
  return await serve.request();
}
interface Collection {
  featureId: number; // 菜单id
  featureCode: string; // 菜单code
  featureName: string;  // 菜单name
  url: string; // 菜单路径
  icon: string; // 菜单icon
  id: string;
}
// 获取收藏列表
export async function GetUserFavoriteFeature() {
  const serve = new HttpResource<Collection>(
    HttpMethod.Get,
    AUTH_PATH + `/getUserFavoriteFeature?moduleName=${App_Name}`
  );
  return await serve.request();
}
// 用户信息
export async function userInfo() {
  //let serve = new HttpResource<Models.UserInfo>(HttpMethod.Get, AUTH_PATH + "/api/psso/ssouser/getUserInfo")
  const serve = new HttpResource<Models.UserInfo>(
    HttpMethod.Get,
    AUTH_PATH + "/getUserInfo"
  );
  const res = await serve.request();
  console.log("用户信息", res);
  const jstr = JSON.stringify(res);
  localStorage.setItem("userinfo", jstr);
  sessionStorage.setItem("userinfo", jstr);
  return res;
}
