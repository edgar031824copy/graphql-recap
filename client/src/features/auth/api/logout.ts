export async function logoutRequest(): Promise<void> {
  await fetch('http://localhost:4000/logout', {
    method: 'POST',
    // 'include' so the browser sends the cookie, letting the server clear it
    credentials: 'include',
  });
}
