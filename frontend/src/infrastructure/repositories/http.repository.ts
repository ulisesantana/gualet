import { HttpDataSource } from "@infrastructure/data-sources";
import { CommandResponse, QueryResponse } from "@domain/types";
import { BaseResponse } from "@infrastructure/types";

export abstract class HttpRepository {
  protected constructor(protected readonly http: HttpDataSource) {}

  protected async handleCommandResponse<
    T extends BaseResponse<Record<string, any>, Error>,
  >(request: Promise<T>): Promise<CommandResponse> {
    try {
      const { success, error } = await request;
      return success
        ? { success: true, reason: null }
        : { success: false, reason: error.message };
    } catch (error: any) {
      return {
        success: false,
        reason:
          error?.response?.data?.error?.message || "An unknown error occurred",
      };
    }
  }

  protected async handleQueryResponse<T>(
    request: Promise<BaseResponse<T, Error>>,
  ): Promise<QueryResponse<T>> {
    try {
      const { success, error, data, pagination } = await request;
      return success
        ? { success: true, reason: null, data, pagination }
        : { success: false, reason: error.message, data, pagination };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        pagination: null,
        reason:
          error?.response?.data?.error?.message || "An unknown error occurred",
      };
    }
  }
}
