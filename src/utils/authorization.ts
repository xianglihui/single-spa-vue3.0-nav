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

// 自动登录
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
  console.log("run");
  let res: any = false; // localStorage.getItem('lsd-menus')
  if (res) {
    return JSON.parse(res);
  } else {
    // App_Name 根据项目名称获取不同菜单列表
    const serve = new HttpResource<Array<MenuData>>(
      HttpMethod.Get,
      AUTH_PATH + `/getMenuTreesByUser?moduleName=${App_Name}`
    );
    console.log("run2", serve);
    res = await serve.request();
    console.log("获取菜单", res);
    configMenus = [];
    if (res.length == 0) {
      console.log("==========")
      return [];
    } else {
      console.log("-----------")
      const data = getNavMapMenu(res[0]["children"]); //菜单list
      sessionStorage.setItem("lsd-menus", JSON.stringify(data));
      sessionStorage.setItem("lsd-config-menus", JSON.stringify(configMenus));
      return data;
    }
  }
}
function getNavMapMenu(res: any) {
  console.log("getNavMapMenu", res);
  let isSubmenu = false;
  return res
    .filter((v: any) => {
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
