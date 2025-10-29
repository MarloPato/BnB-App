import { Hono } from "hono";
import { supabase } from "../utils/supabase";
import { AuthResponse, User } from "../types";

const auth = new Hono();

// Register user
auth.post("/register", async (c) => {
  try {
    const { name, email, password } = await c.req.json();

    if (!name || !email || !password) {
      return c.json({ error: "Name, email, and password are required" }, 400);
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return c.json({ error: "User already exists" }, 400);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return c.json({ error: authError.message }, 400);
    }

    if (!authData.user) {
      return c.json({ error: "Failed to create user" }, 400);
    }

    // Check if email confirmation is required
    if (authData.user.email_confirmed_at === null) {
      return c.json(
        {
          error:
            "Please check your email and click the confirmation link before logging in",
        },
        400
      );
    }

    // Create user profile in our users table
    const userData = {
      id: authData.user.id,
      name,
      email,
      isAdmin: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: user, error: userError } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .single();

    if (userError) {
      return c.json({ error: userError.message }, 400);
    }

    // Use Supabase session token
    const response: AuthResponse = {
      user: user as User,
      token: authData.session!.access_token,
    };

    return c.json(response, 201);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Login user
auth.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Authenticate with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      return c.json({ error: authError.message }, 401);
    }

    if (!authData.user) {
      return c.json({ error: "Authentication failed" }, 401);
    }

    if (!authData.session) {
      return c.json(
        {
          error:
            "Please check your email and click the confirmation link before logging in",
        },
        401
      );
    }

    // Get user profile
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (userError || !user) {
      return c.json({ error: "User profile not found" }, 404);
    }

    // Use Supabase session token
    const response: AuthResponse = {
      user: user as User,
      token: authData.session!.access_token,
    };

    return c.json(response);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Logout user
auth.post("/logout", async (c) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ message: "Logged out successfully" });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get current user
auth.get("/me", async (c) => {
  try {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }

    // Verify token and get user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (userError || !userProfile) {
      return c.json({ error: "User profile not found" }, 404);
    }

    return c.json({ user: userProfile });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default auth;
