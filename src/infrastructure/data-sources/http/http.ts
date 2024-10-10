import { handleErrors, request, HttpMethod } from "./http.utils";

interface JsonResponse<T> {
  data: T;
}

export type HTTP = {
  get: <T>(
    url: string,
    token?: string,
    headerIncluded?: string,
  ) => Promise<JsonResponse<T>>;
  post: <T>(
    url: string,
    data: object,
    token?: string,
  ) => Promise<JsonResponse<T>>;
  put: <T>(
    url: string,
    data?: object,
    token?: string,
  ) => Promise<JsonResponse<T>>;
  patch: <T>(
    url: string,
    data?: object,
    token?: string,
  ) => Promise<JsonResponse<T>>;
  delete: <T>(url: string, token?: string) => Promise<JsonResponse<T>>;
};

export const http: HTTP = {
  get: async <T>(url: string, token?: string): Promise<JsonResponse<T>> => {
    try {
      const response = await request(url, HttpMethod.GET, undefined, token);
      return handleErrors(response);
    } catch (e) {
      throw e;
    }
  },
  post: async <T>(
    url: string,
    data: object,
    token?: string,
  ): Promise<JsonResponse<T>> => {
    try {
      const response = await request(url, HttpMethod.POST, data, token);
      return handleErrors(response);
    } catch (e) {
      throw e;
    }
  },
  put: async <T>(
    url: string,
    data?: object,
    token?: string,
  ): Promise<JsonResponse<T>> => {
    try {
      const response = await request(url, HttpMethod.PUT, data, token);
      return handleErrors(response);
    } catch (e) {
      throw e;
    }
  },
  patch: async <T>(
    url: string,
    data?: object,
    token?: string,
  ): Promise<JsonResponse<T>> => {
    try {
      const response = await request(url, HttpMethod.PATCH, data, token);
      return handleErrors(response);
    } catch (e) {
      throw e;
    }
  },
  delete: async <T>(url: string, token?: string): Promise<JsonResponse<T>> => {
    try {
      const response = await request(url, HttpMethod.DELETE, undefined, token);
      return handleErrors(response);
    } catch (e) {
      throw e;
    }
  },
};
