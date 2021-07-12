import { AUTO_AUTH_PATH, AUTH_PATH } from "@/utils/env";
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
    HttpMethod.Post,
    AUTH_PATH + "/token"
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
// 获取菜单
export function GetMenuItems() {
  const res: any = false; // localStorage.getItem('lsd-menus')

  if (res) {
    return JSON.parse(res);
  } else {
    // let serve = new HttpResource<Array<MenuData>>(
    //   HttpMethod.Get,
    //   AUTH_PATH + `/api/psso/role/getFeatureTreesByUser?moduleName=${App_Name}`
    // );
    // res = await serve.request();
    // // console.log(res)
    // configMenus = [];
    // if (res.length == 0) {
    //   return [];
    // } else {
    //   const data = getNavMapMenu(res[0]["children"]);
    //   sessionStorage.setItem("lsd-menus", JSON.stringify(data));
    //   sessionStorage.setItem("lsd-config-menus", JSON.stringify(configMenus));
    //   return data;
    // }
  }
  console.log("菜单");
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
