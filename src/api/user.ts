import { HttpMethod, HttpResource } from "@/utils/http";
import * as Models from "@/models/Models";

// 拿token
export const initToken = new HttpResource<Models.Code>(
  HttpMethod.Get,
  "/initToken"
);
