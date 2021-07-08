import { HttpMethod, HttpResource } from "@/utils/http";
import * as Models from "@/models/Models";

// 拿token
export const LoginToken = new HttpResource<Models.Code>(
  HttpMethod.Get,
  "/token"
);
