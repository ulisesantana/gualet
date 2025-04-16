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

  async get<T>(url: string, cancelToken?: CancelToken): Promise<T> {
    const response = await this.request<T>({
      url,
      method: HttpMethod.GET,
      cancelToken,
    });
    return this.handleResponse(response);
  }

  async post<T, R>(url: string, data?: T) {
    const response = await this.request({ url, method: HttpMethod.POST, data });
    return this.handleResponse<T>(response) as unknown as R;
  }

  async put<T>(url: string, data: T, cancelToken?: CancelToken) {
    const response = await this.request({
      url,
      method: HttpMethod.PUT,
      data,
      cancelToken,
    });
    return this.handleResponse<T>(response);
  }

  async patch<TResponse, TRequest>(url: string, data: TRequest) {
    const response = await this.request({
      url,
      method: HttpMethod.PATCH,
      data,
    });
    return this.handleResponse<TResponse, TRequest>(response);
  }

  async delete(url: string) {
    const response = await this.request({ url, method: HttpMethod.DELETE });
    return this.handleResponse(response);
  }

  private async request<T>({
    url,
    method,
    data,
    cancelToken,
  }: {
    url: string;
    method: HttpMethod;
    data?: T;
    cancelToken?: CancelToken;
  }): Promise<AxiosResponse<T>> {
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

  private handleResponse<T, R = T>(res: AxiosResponse<R>): R {
    if (
      res.headers?.["content-type"]?.includes("application/json") ||
      res.data
    ) {
      return res.data;
    }

    return res as unknown as R;
  }
}
