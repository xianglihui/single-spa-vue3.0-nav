import axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import qs from "qs";
import { ElMessage } from "element-plus";
import { AJAX_PATH } from "@/utils/env";

const service = axios.create({
  baseURL: AJAX_PATH, //process.env.BASE_URL,  // api的base_url
  timeout: 10000, // 请求超时时间
});

service.interceptors.request.use(
  (config) => {
    // apm
    // apm.ampHanleRequest(config)
    // 请求前
    return config;
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);
// 场景1：对token没有要求逻辑
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("error", error);
    // 由于json-server mock捕获不了错误日志 这里视实际项目需求而定 2021-07-12
    // if (error.response.status === 401) {
    //   ElMessage({
    //     message: "登录失效，请重新登录",
    //     type: "error",
    //     onClose: () => {
    //       localStorage.clear();
    //       sessionStorage.clear();
    //       window.location.href = "/login";
    //     },
    //   });
    // } else if (error.response.status === 400) {
    //   if (
    //     error.response.data.error_description &&
    //     error.response.data.error_description ===
    //       "noCode"
    //   ) {
    //     ElMessage.error("请验证手机验证码");
    //   } else {
    //     ElMessage.error(error.response.data.error_description);
    //   }
    // } else {
    //   ElMessage.error("请求失败，请查看控制台提示");
    // }
    // return Promise.reject(error);
  }
);
// 场景2：无感刷新token逻辑
// 是否正在刷新的标记
// let isRefreshing = false;
// //重试队列
// let requests = [];
// service.interceptors.response.use(
//   (response) => {
//     //约定code 409 token 过期
//     if (response.data.code === 409) {
//       if (!isRefreshing) {
//         isRefreshing = true;
//         //调用刷新token的接口
//         return refreshToken({
//           refreshToken: localStorage.getItem("refreshToken"),
//           token: getToken(),
//         })
//           .then((res) => {
//             const { token } = res.data;
//             // 替换token
//             setToken(token);
//             response.headers.Authorization = `${token}`;
//           })
//           .catch((err) => {
//             //跳到登录页
//             removeToken();
//             router.push("/login");
//             return Promise.reject(err);
//           })
//           .finally(() => {
//             isRefreshing = false;
//           });
//       } else {
//         // 返回未执行 resolve 的 Promise
//         return new Promise((resolve) => {
//           // 用函数形式将 resolve 存入，等待刷新后再执行
//           requests.push((token) => {
//             response.headers.Authorization = `${token}`;
//             resolve(service(response.config));
//           });
//         });
//       }
//     }
//     return response && response.data;
//   },
//   (error) => {
//     ElMessage.error(error.response.data.msg);
//     return Promise.reject(error);
//   }
// );

interface ResponseError {
  code: number;
  details?: string;
  message: string;
  validationErrors?: Record<string, unknown>;
}

interface BaseResponse<T> {
  result: T;
  success: boolean;
  error?: ResponseError;
  unAuthorizedRequest: boolean;
}

export enum HttpMethod {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Delete = "DELETE",
}

type UnionResponse<T> = BaseResponse<T> | T;

export class HttpResource<T> {
  protected readonly url: string;
  protected readonly httpMethod: HttpMethod;

  protected get serviceInstance(): AxiosInstance {
    return service;
  }

  constructor(method: HttpMethod, apiUrl: string) {
    console.log("method", method);
    console.log("apiUrl", apiUrl);
    this.url = apiUrl;
    this.httpMethod = method;
  }

  private isBoxed<T>(resp: UnionResponse<T>): resp is BaseResponse<T> {
    return (<BaseResponse<T>>resp).result !== undefined;
  }
  async request(
    data?: Record<string, unknown> | string,
    contentType = "application/x-www-form-urlencoded"
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      method: this.httpMethod,
      url: this.url,
      headers: {
        "Content-Type": contentType,
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      paramsSerializer: function (params) {
        console.log("params", params);
        return qs.stringify(params, { indices: false });
      },
    };
    if (
      this.httpMethod == HttpMethod.Post ||
      this.httpMethod == HttpMethod.Put
    ) {
      config["data"] = data;
    } else {
      config["params"] = data;
    }
    const res: AxiosResponse<UnionResponse<T>> = await this.serviceInstance(
      config
    );
    if (this.isBoxed(res.data)) {
      if (
        res.data.success &&
        res.data.error === null &&
        !res.data.unAuthorizedRequest
      ) {
        return res.data.result;
      } else {
        throw res.data.error;
      }
    } else {
      return res.data;
    }
  }
}

export class CachedResource<T> extends HttpResource<T> {
  private cache?: T;
  async request(
    data?: Record<string, unknown>,
    contentType = "application/json-patch+json"
  ): Promise<T> {
    if (this.cache) {
      return this.cache;
    } else {
      const result = await super.request(data, contentType);
      this.cache = result;
      return this.cache;
    }
  }
}
