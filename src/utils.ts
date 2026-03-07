import type { Awaitable } from './types';

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m;
  // eslint-disable-next-line ts/no-explicit-any -- for default
  return (resolved as any).default || resolved;
}
