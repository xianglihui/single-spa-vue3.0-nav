import { AUTO_AUTH_PATH,AUTH_PATH } from "@/utils/env";
import axios from "axios";
import * as Models from "@/models/Models"
import { HttpResource, HttpMethod } from "@/utils/http"
export async function AutoAuthorization() {
  let config: object = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  let autoLoginURL: string =
    AUTO_AUTH_PATH + "/api/domainidentity/connect/token";
  return await axios.post(autoLoginURL, null, config).then((res) => res.data);
}

export async function Authorization(options: Models.AuthReq) {
    let params: string = ""
    let property: string = ""
    for (let property in options) {
        if (options[property]) {
            params += `&${property}=${options[property]}`
        }
    }
    params = params.substring(1, params.length)
    let serve = new HttpResource<Models.AuthRes>(HttpMethod.Post, AUTH_PATH + "/connect/token")
    let res = await serve.request(params)
    if (res.access_token) {
        let saveTime: Date = new Date()
        sessionStorage.setItem("saveTime", String(saveTime.getTime()))
        sessionStorage.setItem("saveOpts", JSON.stringify(options))
        return res
    } else {
        return {}
    }
}