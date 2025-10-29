import { Hono } from "hono";
import { supabase } from "../utils/supabase";
import { authMiddleware, AuthContext } from "../middleware/auth";
import { CreateBookingRequest } from "../types";

const bookings = new Hono();

// Helper function to calculate total price
function calculateTotalPrice(
  checkindate: string,
  checkoutdate: string,
  pricepernight: number
): number {
  const checkIn = new Date(checkindate);
  const checkOut = new Date(checkoutdate);
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff * pricepernight;
}

// Get all bookings for authenticated user
bookings.get("/", authMiddleware, async (c) => {
  try {
    const authCtx = c as unknown as AuthContext;
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        properties (
          id,
          name,
          location,
          pricepernight
        ),
        users (
          id,
          name,
          email
        )
      `
      )
      .eq("user_id", authCtx.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ bookings: data });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get booking by ID
bookings.get("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const authCtx = c as unknown as AuthContext;

    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        properties (
          id,
          name,
          location,
          pricepernight
        ),
        users (
          id,
          name,
          email
        )
      `
      )
      .eq("id", id)
      .eq("user_id", authCtx.user.id)
      .single();

    if (error) {
      return c.json({ error: error.message }, 404);
    }

    return c.json({ booking: data });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Create booking
bookings.post("/", authMiddleware, async (c) => {
  try {
    const body = (await c.req.json()) as CreateBookingRequest;
    const authCtx = c as unknown as AuthContext;

    console.log("Booking request body:", body);

    // Validate dates
    const checkInDate = new Date(body.checkindate);
    const checkOutDate = new Date(body.checkoutdate);

    if (checkInDate >= checkOutDate) {
      return c.json(
        { error: "Check-out date must be after check-in date" },
        400
      );
    }

    if (checkInDate < new Date()) {
      return c.json({ error: "Check-in date cannot be in the past" }, 400);
    }

    // Get property details
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("*")
      .eq("id", body.property_id)
      .single();

    if (propertyError || !property) {
      console.error("Property fetch error:", propertyError);
      return c.json({ error: "Property not found" }, 404);
    }

    console.log("Property data:", property);
    console.log("Property price_per_night:", property.price_per_night);

    if (!property.availability) {
      return c.json({ error: "Property is not available" }, 400);
    }

    // Check for existing bookings that overlap
    const { data: existingBookings, error: bookingCheckError } = await supabase
      .from("bookings")
      .select("*")
      .eq("property_id", body.property_id);

    if (bookingCheckError) {
      console.error("Booking check error:", bookingCheckError);
      return c.json(
        {
          error: "Error checking existing bookings",
          details: bookingCheckError.message,
        },
        500
      );
    }

    // Check for overlapping bookings in JavaScript
    const newCheckIn = new Date(body.checkindate);
    const newCheckOut = new Date(body.checkoutdate);

    const hasOverlap = existingBookings?.some((booking) => {
      const existingCheckIn = new Date(booking.checkindate);
      const existingCheckOut = new Date(booking.checkoutdate);

      // Check if the new booking overlaps with existing booking
      return newCheckIn < existingCheckOut && newCheckOut > existingCheckIn;
    });

    if (hasOverlap) {
      return c.json(
        { error: "Property is already booked for these dates" },
        400
      );
    }

    // Calculate total price
    const totalPrice = calculateTotalPrice(
      body.checkindate,
      body.checkoutdate,
      property.pricepernight
    );

    console.log("Calculating price with property:", property);
    console.log("Price per night value:", property.pricepernight);

    const bookingData = {
      user_id: authCtx.user.id,
      property_id: body.property_id,
      checkindate: body.checkindate,
      checkoutdate: body.checkoutdate,
      totalprice: totalPrice,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("bookings")
      .insert(bookingData)
      .select(
        `
        *,
        properties (
          id,
          name,
          location,
          pricepernight
        ),
        users (
          id,
          name,
          email
        )
      `
      )
      .single();

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ booking: data }, 201);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Update booking (only by the user who created it)
bookings.put("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const body = (await c.req.json()) as Partial<CreateBookingRequest>;
    const authCtx = c as unknown as AuthContext;

    // Check if booking exists and user has permission
    const { data: existingBooking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .eq("user_id", authCtx.user.id)
      .single();

    if (fetchError) {
      return c.json({ error: "Booking not found" }, 404);
    }

    // If updating dates, recalculate price
    const updateData: any = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    if (body.checkindate || body.checkoutdate) {
      const checkInDate = body.checkindate || existingBooking.checkindate;
      const checkOutDate = body.checkoutdate || existingBooking.checkoutdate;

      // Get property price
      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .select("pricepernight")
        .eq("id", existingBooking.property_id)
        .single();

      if (propertyError) {
        return c.json({ error: "Property not found" }, 404);
      }

      updateData.totalprice = calculateTotalPrice(
        checkInDate,
        checkOutDate,
        property.pricepernight
      );
    }

    const { data, error } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        *,
        properties (
          id,
          name,
          location,
          pricepernight
        ),
        users (
          id,
          name,
          email
        )
      `
      )
      .single();

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ booking: data });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Delete booking
bookings.delete("/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param("id");
    const authCtx = c as unknown as AuthContext;

    // Check if booking exists and user has permission
    const { error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .eq("user_id", authCtx.user.id)
      .single();

    if (fetchError) {
      return c.json({ error: "Booking not found" }, 404);
    }

    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ message: "Booking deleted successfully" });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default bookings;
