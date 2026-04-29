import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../models/userModel.js";

const COOKIE_NAME = "token";
const COOKIE_OPTIONS = {
  httpOnly: true, // JS can never read this cookie
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod; HTTP ok in dev
  sameSite: "strict" as const, // never sent on cross-site requests (CSRF protection)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms, matches JWT expiry
  path: "/",
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await findUserByEmail(email);
  if (!user || user.password !== password) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = jwt.sign(
    { sub: user.id, email: user.email, companyId: user.companyId },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );
  // Set the token as an httpOnly cookie — the client never touches it directly
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
  // Only return the email so the UI knows who is logged in
  res.json({ email: user.email });
};

export const logoutController = (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
};

export const meController = (req: Request, res: Response) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
      email: string;
    };
    res.json({ email: payload.email });
  } catch {
    // Token is expired or tampered — treat as logged out
    res.clearCookie(COOKIE_NAME, { path: "/" });
    res.status(401).json({ error: "Session expired" });
  }
};
