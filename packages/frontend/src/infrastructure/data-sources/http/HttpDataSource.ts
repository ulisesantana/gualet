import { Nullable } from "@domain/types";
import axios, { AxiosHeaders, AxiosResponse, CancelToken, Method } from "axios";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export class HttpDataSource {
  constructor(private readonly token: Nullable<string> = null) {}

  async get<ResponseBody>(
    url: string,
    cancelToken?: CancelToken,
  ): Promise<ResponseBody> {
    const response = await this.request<null, ResponseBody>({
      url,
      method: HttpMethod.GET,
      cancelToken,
    });
    return this.handleResponse(response);
  }

  async post<RequestBody, ResponseBody>(url: string, data?: RequestBody) {
    const response = await this.request<RequestBody, ResponseBody>({
      url,
      method: HttpMethod.POST,
      data,
    });
    return this.handleResponse(response);
  }

  async put<RequestBody, ResponseBody>(
    url: string,
    data: RequestBody,
    cancelToken?: CancelToken,
  ) {
    const response = await this.request<RequestBody, ResponseBody>({
      url,
      method: HttpMethod.PUT,
      data,
      cancelToken,
    });
    return this.handleResponse(response);
  }

  async patch<RequestBody, ResponseBody>(url: string, data: RequestBody) {
    const response = await this.request<RequestBody, ResponseBody>({
      url,
      method: HttpMethod.PATCH,
      data,
    });
    return this.handleResponse(response);
  }

  async delete<ResponseBody>(url: string) {
    const response = await this.request<null, ResponseBody>({
      url,
      method: HttpMethod.DELETE,
    });
    return this.handleResponse(response);
  }

  private async request<RequestBody, ResponseBody>({
    url,
    method,
    data,
    cancelToken,
  }: {
    url: string;
    method: HttpMethod;
    data?: RequestBody;
    cancelToken?: CancelToken;
  }): Promise<AxiosResponse<ResponseBody>> {
    const headers = new AxiosHeaders();
    headers.setContentType("application/json");

    if (this.token) {
      headers.setAuthorization(`Bearer ${this.token}`);
    }

    return axios({
      url,
      method: method as Method,
      headers,
      data,
      cancelToken,
    });
  }

  private handleResponse<R>(res: AxiosResponse<R>): R {
    if (
      res.headers?.["content-type"]?.includes("application/json") ||
      res.data
    ) {
      return res.data;
    }

    return res as unknown as R;
  }
}
