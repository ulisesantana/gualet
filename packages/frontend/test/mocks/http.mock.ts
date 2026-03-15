import {vi} from "vitest";

export class MockHttpDatasource {
  delete = vi.fn()
  get = vi.fn()
  patch = vi.fn()
  post = vi.fn()
  put = vi.fn()

  constructor(_token?: string | null) {}
}
