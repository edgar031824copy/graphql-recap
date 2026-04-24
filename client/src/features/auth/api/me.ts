import type { MeResponse } from '../types.ts';

export async function fetchMe(): Promise<MeResponse> {
  const res = await fetch('http://localhost:4000/me', {
    // 'include' so the browser sends the cookie on this cross-origin request
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json() as Promise<MeResponse>;
}
