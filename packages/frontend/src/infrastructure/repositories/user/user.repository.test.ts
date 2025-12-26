import { UserCredentials } from "@application/repositories";
import { HttpDataSource } from "@infrastructure/data-sources";
import { BaseResponse } from "@infrastructure/types";
import { beforeEach, describe, it, Mocked, vi } from "vitest";

import { UserRepositoryImplementation, UserResponse } from "./user.repository";

describe("UserRepositoryImplementation", () => {
  let repository: UserRepositoryImplementation;
  let mockHttp: Mocked<HttpDataSource>;

  beforeEach(() => {
    mockHttp = {
      get: vi.fn().mockResolvedValue({ success: true } as UserResponse),
      post: vi.fn().mockResolvedValue({ success: true } as UserResponse),
    } as unknown as Mocked<HttpDataSource>;
    repository = new UserRepositoryImplementation(mockHttp);
  });

  describe("isLoggedIn", () => {
    it("should return true when the request is successful", async () => {
      mockHttp.post.mockResolvedValue({ success: true } as BaseResponse);

      const result = await repository.isLoggedIn();

      expect(mockHttp.post).toHaveBeenCalledWith("/api/auth/verify");
      expect(result).toBe(true);
    });

    it("should return false when the request is unsuccessful", async () => {
      mockHttp.post.mockResolvedValue({ success: false } as BaseResponse);

      const result = await repository.isLoggedIn();

      expect(mockHttp.post).toHaveBeenCalledWith("/api/auth/verify");
      expect(result).toBe(false);
    });

    it("should return false if the request fails", async () => {
      const error = new Error("Network error");
      mockHttp.post.mockRejectedValue(error);

      const result = await repository.isLoggedIn();

      expect(result).toBe(false);
    });
  });

  describe("login", () => {
    it("should call the post method with the correct credentials", async () => {
      const credentials: UserCredentials = {
        email: "user@example.com",
        password: "password123",
      };

      await repository.login(credentials);

      expect(mockHttp.post).toHaveBeenCalledWith(
        "/api/auth/login",
        credentials,
      );
    });

    it("should propagate the exception if the request fails", async () => {
      mockHttp.post.mockRejectedValue({
        response: { data: { error: { message: "Authentication error" } } },
      });
      const credentials: UserCredentials = {
        email: "user@example.com",
        password: "password123",
      };

      const result = await repository.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Authentication error");
    });
  });

  describe("logout", () => {
    it("should call the post method with the correct path", async () => {
      await repository.logout();

      expect(mockHttp.post).toHaveBeenCalledWith("/api/auth/logout");
    });

    it("should propagate the exception if the request fails", async () => {
      mockHttp.post.mockRejectedValue({
        response: { data: { error: { message: "Authentication error" } } },
      });

      const result = await repository.logout();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Authentication error");
    });
  });

  describe("register", () => {
    it("should call the post method with the correct credentials", async () => {
      const credentials: UserCredentials = {
        email: "new_user@example.com",
        password: "password123",
      };

      await repository.register(credentials);

      expect(mockHttp.post).toHaveBeenCalledWith(
        "/api/auth/register",
        credentials,
      );
    });

    it("should propagate the exception if the request fails", async () => {
      mockHttp.post.mockRejectedValue({
        response: { data: { error: { message: "Authentication error" } } },
      });
      const credentials: UserCredentials = {
        email: "user@example.com",
        password: "password123",
      };

      const result = await repository.register(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Authentication error");
    });
  });
});
