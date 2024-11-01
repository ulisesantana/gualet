import {vi} from "vitest";

export class MockSupabaseClient {
  auth = {
    signIn: vi.fn().mockResolvedValue({user: null, session: null}),
    signInWithPassword: vi.fn().mockResolvedValue({user: null, session: null}),
    signOut: vi.fn().mockResolvedValue({error: null}),
    signUp: vi.fn().mockResolvedValue({error: null}),
    session: vi.fn().mockReturnValue(null),
  };
  from = vi.fn(() => this);
  select = vi.fn(() => this);
  order = vi.fn(() => this);
  eq = vi.fn(() => this);
  limit = vi.fn(() => this);
  insert = vi.fn(() => this);
  update = vi.fn(() => this);
  delete = vi.fn(() => this);
  private result = null

  withResult(x: any) {
    this.result = x
    return this
  }

  then(cb: Function) {
    return cb(this.result)
  }

  catch(cb: Function) {
    return cb()
  }
}
