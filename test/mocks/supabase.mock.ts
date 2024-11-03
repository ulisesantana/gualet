import {vi} from "vitest";

interface SupabaseResult {
  data: any[]
  error?: any
}

export class MockSupabaseClient {
  auth = {
    getSession: vi.fn().mockResolvedValue({error: null, data: {session: {}}}),
    onAuthStateChange: vi.fn().mockReturnValue({
      error: null,
      data: {
        subscription: {
          unsubscribe: vi.fn()
        }
      },
    }),
    signIn: vi.fn().mockResolvedValue({user: null, session: null}),
    signInWithPassword: vi.fn().mockResolvedValue({user: null, session: null}),
    signOut: vi.fn().mockResolvedValue({error: null}),
    signUp: vi.fn().mockResolvedValue({error: null}),
    session: vi.fn().mockReturnValue(null),
  };
  from = vi.fn((x: string) => this);
  select = vi.fn(() => this);
  order = vi.fn(() => this);
  eq = vi.fn(() => this);
  limit = vi.fn(() => this);
  insert = vi.fn(() => this);
  update = vi.fn(() => this);
  upsert = vi.fn(() => this);
  delete = vi.fn(() => this);
  private result: SupabaseResult[] = [{data: []}]

  withResult(newResult: SupabaseResult | SupabaseResult[]) {
    if (Array.isArray(newResult)) {
      this.result = newResult
    } else {
      this.result = [newResult]
    }
    return this
  }

  then(cb: Function) {
    if (this.result.length <= 1) {
      return cb(this.result[0])
    }
    return cb(this.result.shift())
  }

  catch(cb: Function) {
    return cb()
  }
}
