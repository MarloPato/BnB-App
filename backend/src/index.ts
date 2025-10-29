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
    origin: "*",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", (c) => {
  return c.body(null, 204, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  });
});

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

const handler = async (req: Request) => {
  return app.fetch(req);
};

export default handler;
export { handler };

if (process.env.NODE_ENV !== "production") {
  const { serve } = require("@hono/node-server");
  const port = process.env.PORT || 3001;
  console.log(`Server is running on port ${port}`);
  serve({
    fetch: app.fetch,
    port: Number(port),
  });
}
