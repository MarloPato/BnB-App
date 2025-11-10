import { Hono } from "hono";
import { cors } from "hono/cors";
import dotenv from "dotenv";

import auth from "./routes/auth";
import properties from "./routes/properties";
import bookings from "./routes/bookings";

dotenv.config();

const app = new Hono();

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (origin === "http://localhost:3000") {
        return origin;
      } else return "https://bnb-frontend-black.vercel.app";
    },
    allowHeaders: [
      "Authorization",
      "Content-Type",
      "Access-Control-Allow-Origin",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    exposeHeaders: ["Set-Cookie"],
  })
);

app.get("/", (c) => {
  return c.json({ message: "BnB Management API is running!" });
});

app.route("/api/auth", auth);
app.route("/api/properties", properties);
app.route("/api/bookings", bookings);

app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

app.onError((err, c) => {
  console.error("Error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;

if (process.env.NODE_ENV !== "production") {
  const { serve } = require("@hono/node-server");
  const port = process.env.PORT || 3001;
  console.log(`Server is running on port ${port}`);
  serve({
    fetch: app.fetch,
    port: Number(port),
  });
}
