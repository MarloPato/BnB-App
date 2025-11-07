import { Hono } from "hono";
import { cors } from "hono/cors";
import dotenv from "dotenv";

import auth from "./routes/auth";
import properties from "./routes/properties";
import bookings from "./routes/bookings";

dotenv.config();

const app = new Hono();

// ✅ Fixed CORS: works in Vercel serverless
app.use(
  "*",
  cors({
    origin: (origin, _c) => {
      // Allow production + local frontend
      const allowedOrigins = [
        "https://bnb-frontend-black.vercel.app",
        "http://localhost:3000",
      ];

      if (!origin) return null;

      if (allowedOrigins.includes(origin)) {
        return origin;
      }

      // If you want to allow Vercel preview builds, uncomment:
      // if (/^https:\/\/bnb-frontend-black-.*\.vercel\.app$/.test(origin)) {
      //   return origin;
      // }

      return null;
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Root route
app.get("/", (c) => c.json({ message: "BnB Management API is running!" }));

// ✅ API routes
app.route("/api/auth", auth);
app.route("/api/properties", properties);
app.route("/api/bookings", bookings);

// ✅ Fallback routes
app.notFound((c) => c.json({ error: "Not Found" }, 404));

app.onError((err, c) => {
  console.error("Error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

// ✅ Vercel edge-compatible export
export const config = {
  runtime: "edge", // make sure it's deployed as edge
};

export default app;

// ✅ Local dev (ignored by Vercel)
if (process.env.NODE_ENV !== "production") {
  const { serve } = require("@hono/node-server");
  const port = process.env.PORT || 3001;
  console.log(`Server is running on port ${port}`);
  serve({
    fetch: app.fetch,
    port: Number(port),
  });
}
