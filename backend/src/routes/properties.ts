import { Hono } from "hono";
import { supabase } from "../utils/supabase";
import {
  authMiddleware,
  AuthContext,
  adminMiddleware,
} from "../middleware/auth";
import { CreatePropertyRequest, UpdatePropertyRequest } from "../types";

const properties = new Hono();

// Get all properties (public - for browsing)
properties.get("/", async (c) => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("availability", true)
      .order("created_at", { ascending: false });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ properties: data });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get all properties (admin only - includes unavailable)
properties.get("/all", authMiddleware, adminMiddleware, async (c) => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ properties: data });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get user's own properties (authenticated)
properties.get("/my", authMiddleware, async (c) => {
  try {
    const authCtx = c as unknown as AuthContext;
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("user_id", authCtx.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ properties: data });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get property by ID
properties.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return c.json({ error: error.message }, 404);
    }

    return c.json({ property: data });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Create property (authenticated users only)
properties.post("/", authMiddleware, async (c) => {
  try {
    const body = (await c.req.json()) as CreatePropertyRequest;
    const authCtx = c as unknown as AuthContext;

    const propertyData = {
      name: body.name,
      description: body.description,
      location: body.location,
      pricepernight: body.pricepernight,
      availability: body.availability,
      image_url: body.image_url,
      user_id: authCtx.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("properties")
      .insert(propertyData)
      .select()
      .single();

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ property: data }, 201);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Update property (owner or admin only)
properties.put("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const body = (await c.req.json()) as UpdatePropertyRequest;
    const authCtx = c as unknown as AuthContext;

    // Check if property exists and user has permission
    const { data: existingProperty, error: fetchError } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      return c.json({ error: "Property not found" }, 404);
    }

    // Check if user is owner or admin
    if (existingProperty.user_id !== authCtx.user.id && !authCtx.user.isAdmin) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const updateData = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("properties")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ property: data });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Delete property (owner or admin only)
properties.delete("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const authCtx = c as unknown as AuthContext;

    // Check if property exists and user has permission
    const { data: existingProperty, error: fetchError } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      return c.json({ error: "Property not found" }, 404);
    }

    // Check if user is owner or admin
    if (existingProperty.user_id !== authCtx.user.id && !authCtx.user.isAdmin) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const { error } = await supabase.from("properties").delete().eq("id", id);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ message: "Property deleted successfully" });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default properties;
