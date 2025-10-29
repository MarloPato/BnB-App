import { Context, Next } from "hono";
import { supabase } from "../utils/supabase";
import { User } from "../types";

export interface AuthContext extends Context {
  user: User;
}

export async function authMiddleware(c: Context, next: Next) {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }

    // Use Supabase's JWT verification
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    // Get user profile from your users table
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !userProfile) {
      return c.json({ error: "User profile not found" }, 404);
    }

    (c as AuthContext).user = userProfile as User;
    return await next();
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
}

export async function adminMiddleware(c: Context, next: Next) {
  const authCtx = c as AuthContext;

  if (!authCtx.user || !authCtx.user.isAdmin) {
    return c.json({ error: "Admin access required" }, 403);
  }

  return await next();
}
