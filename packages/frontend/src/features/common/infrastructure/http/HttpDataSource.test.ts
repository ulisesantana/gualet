import { afterEach, beforeEach, describe, expect, it } from "vitest";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { HttpDataSource } from "./HttpDataSource";

describe("HttpDataSource with axios-mock-adapter", () => {
  let httpDataSource: HttpDataSource;
  let mock: AxiosMockAdapter;

  beforeEach(() => {
    httpDataSource = new HttpDataSource();
    mock = new AxiosMockAdapter(axios);
  });

  afterEach(() => {
    mock.reset(); // Resets the mock state after each test
  });

  describe("get", () => {
    it("should call axios with GET method and return data", async () => {
      const responseData = { message: "Hello, GET!" };
      mock.onGet("/test-url").reply(200, responseData);

      const result = await httpDataSource.get<typeof responseData>("/test-url");

      expect(result).toEqual(expect.objectContaining(responseData));
    });

    it("should throw Error on non-200 response", async () => {
      mock.onGet("/test-url").reply(404, {});

      await expect(httpDataSource.get("/test-url")).rejects.toThrow(Error);
      await expect(httpDataSource.get("/test-url")).rejects.toThrow(
        "Request failed with status code 404",
      );
    });

    it("should handle if response is JSON", async () => {
      mock.onGet("/json-url").reply(
        200,
        { meh: 42 },
        {
          "content-type": "application/json",
        },
      );

      const result = await httpDataSource.get("/json-url");

      expect(result).toEqual({ meh: 42 });
    });

    it("should handle if response is not JSON", async () => {
      mock.onGet("/non-json-url").reply(200, '<html lang="en">Hi!</html>', {
        "content-type": "text/html",
      });

      const result = await httpDataSource.get("/non-json-url");

      expect(result).toEqual('<html lang="en">Hi!</html>');
    });

    it("with token", async () => {
      mock.onGet("/with-token").reply((config) => {
        expect(config.headers?.Authorization).toBe("Bearer tokensito");
        return [200, { data: "some data" }];
      });

      await new HttpDataSource("tokensito").get("/with-token");
    });

    it("without token by default", async () => {
      mock.onGet("/without-token").reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { data: "some data" }];
      });

      await httpDataSource.get("/without-token");
    });
  });

  describe("post", () => {
    it("should call axios with POST method and return data", async () => {
      const responseData = { message: "Hello, POST!" };
      mock.onPost("/test-url").reply(200, responseData);

      const result = await httpDataSource.post("/test-url", responseData);

      expect(result).toEqual(responseData);
    });

    it("with token", async () => {
      mock.onPost("/with-token").reply((config) => {
        expect(config.headers?.Authorization).toBe("Bearer tokensito");
        return [200, { data: "some data" }];
      });

      await new HttpDataSource("tokensito").post("/with-token", {});
    });

    it("without token by default", async () => {
      mock.onPost("/without-token").reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { data: "some data" }];
      });

      await httpDataSource.post("/without-token", {});
    });
  });

  describe("put", () => {
    it("should call axios with PUT method and return data", async () => {
      const responseData = { message: "Hello, PUT!" };
      mock.onPut("/test-url").reply(200, responseData);

      const result = await httpDataSource.put("/test-url", responseData);

      expect(result).toEqual(responseData);
    });

    it("with token", async () => {
      mock.onPut("/with-token").reply((config) => {
        expect(config.headers?.Authorization).toBe("Bearer tokensito");
        return [200, { data: "some data" }];
      });

      await new HttpDataSource("tokensito").put("/with-token", {});
    });

    it("without token by default", async () => {
      mock.onPut("/without-token").reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { data: "some data" }];
      });

      await httpDataSource.put("/without-token", {});
    });
  });

  describe("patch", () => {
    it("should call axios with PATCH method and return data", async () => {
      const responseData = { message: "Hello, PATCH!" };
      mock.onPatch("/test-url").reply(200, responseData);

      const result = await httpDataSource.patch("/test-url", responseData);

      expect(result).toEqual(responseData);
    });

    it("with token", async () => {
      mock.onPatch("/with-token").reply((config) => {
        expect(config.headers?.Authorization).toBe("Bearer tokensito");
        return [200, { data: "some data" }];
      });

      await new HttpDataSource("tokensito").patch("/with-token", {});
    });

    it("without token by default", async () => {
      mock.onPatch("/without-token").reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { data: "some data" }];
      });

      await httpDataSource.patch("/without-token", {});
    });
  });

  describe("delete", () => {
    it("should call axios with DELETE method and return data", async () => {
      const responseData = { message: "Hello, DELETE!" };
      mock.onDelete("/test-url").reply(200, responseData);

      const result = await httpDataSource.delete("/test-url");

      expect(result).toEqual(responseData);
    });

    it("with token", async () => {
      mock.onDelete("/with-token").reply((config) => {
        expect(config.headers?.Authorization).toBe("Bearer tokensito");
        return [200, { data: "some data" }];
      });

      await new HttpDataSource("tokensito").delete("/with-token");
    });

    it("without token by default", async () => {
      mock.onDelete("/without-token").reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { data: "some data" }];
      });

      await httpDataSource.delete("/without-token");
    });
  });

  describe("Error Handling", () => {
    it("should throw Error if response status is not 200", async () => {
      mock
        .onGet("/error-url")
        .reply(500, {}, { statusText: "Internal Server Error" });

      await expect(httpDataSource.get("/error-url")).rejects.toThrow(
        "Request failed with status code 500",
      );
    });
  });
});
