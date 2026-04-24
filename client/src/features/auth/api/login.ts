import type { LoginPayload, LoginResponse } from '../types.ts';

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch('http://localhost:4000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // 'include' tells the browser to store the Set-Cookie from the response
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json() as Promise<LoginResponse>;
}
