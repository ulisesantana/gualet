import {HttpDataSource} from "@infrastructure/data-sources";
import {vi} from "vitest";

export class MockHttpDatasource implements HttpDataSource {
  delete = vi.fn()
  get = vi.fn()
  patch = vi.fn()
  post = vi.fn()
  put = vi.fn()
}
