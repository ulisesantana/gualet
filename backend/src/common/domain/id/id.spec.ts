import { Id } from './id';

describe('Id', () => {
  it('should generate a new id if no value is provided', () => {
    const id = new Id();
    expect(id.value).toMatch(/^[0-9a-fA-F-]{36}$/);
  });

  it('should use the provided value as id', () => {
    const customValue = '1234';
    const id = new Id(customValue);
    expect(id.value).toBe(customValue);
  });

  it('should return the id value as string', () => {
    const id = new Id('5678');
    expect(id.toString()).toBe('5678');
  });

  it('should check equality with another Id instance', () => {
    const id1 = new Id('abcd');
    const id2 = new Id('abcd');
    const id3 = new Id('efgh');
    expect(id1.equals(id2)).toBe(true);
    expect(id1.equals(id3)).toBe(false);
  });

  it('should check equality with a string', () => {
    const id = new Id('ijkl');
    expect(id.equals('ijkl')).toBe(true);
    expect(id.equals('mnop')).toBe(false);
  });
});
