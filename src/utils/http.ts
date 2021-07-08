import axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import qs from "qs";
import { ElMessage } from 'element-plus'
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

service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      ElMessage({
          message: "登录失效，请重新登录",
          type: 'error',
          onClose: ()=>{
              localStorage.clear()
              sessionStorage.clear()
              window.location.href = "/login"
          }
      })
    } else if (error.response.status === 400) {
      if (
        error.response.data.error_description &&
        error.response.data.error_description ===
          "RequiredPhoneVerificationCode"
      ) {
        ElMessage.error("请验证手机验证码")
      } else {
        ElMessage.error(error.response.data.error_description)
      }
    } else {
      ElMessage.error("请求失败，请查看控制台提示")
    }
    return Promise.reject(error);
  }
);

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
