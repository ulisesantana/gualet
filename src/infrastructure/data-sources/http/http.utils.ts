export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

class RequestError extends Error {
  constructor(status: number, text: string) {
    super(`Code ${status}. ${text}`);
  }
}

export function request(
  url: string,
  method: HttpMethod,
  data?: object,
  token?: string,
): Promise<Response> {
  const headers = new Headers({});

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    method,
    headers,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrer: "no-referrer",
  };

  if (data !== undefined) {
    headers.append("Content-Type", "application/json; charset=utf-8");
    config.body = JSON.stringify(data, null, 2);
  }

  try {
    return fetch(url, config);
  } catch (e) {
    console.error(`Fetch Error =\n`, e);
    throw e;
  }
}

export function handleErrors<T>(res: Response): Promise<{ data: T }> {
  if (!res.ok) {
    throw new RequestError(res.status, res.statusText);
  }

  if (!!res.headers.get("Content-Range")) {
    return res.json().then((json) => ({
      data: json,
      contentRange: res.headers.get("Content-Range"),
    }));
  }

  if (res.headers.get("Content-Type")!.includes("application/json")) {
    return res.json().then((json) => ({
      data: json,
      contentRange: res.headers.get("Content-Range"),
    }));
  }

  return Promise.resolve({ data: {} as T });
}
