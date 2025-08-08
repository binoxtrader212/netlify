import { createClient } from "@supabase/supabase-js";

export async function handler(event, context) {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
    const TWELVE_API_KEY = process.env.TWELVE_API_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE || !TWELVE_API_KEY) {
      return { statusCode: 500, body: "Missing server env vars." };
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
    const authHeader = event.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return { statusCode: 401, body: "Unauthorized: no token" };

    const { data: userData, error } = await supabase.auth.getUser(token);
    if (error || !userData?.user) {
      return { statusCode: 401, body: "Unauthorized" };
    }

    const params = new URLSearchParams(event.queryStringParameters || {});
    const symbol = params.get("symbol") || "EUR/USD";

    const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=1min&outputsize=60&apikey=${TWELVE_API_KEY}`;
    const resp = await fetch(url);
    const json = await resp.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // tighten in prod
      },
      body: JSON.stringify(json),
    };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: "Internal error" };
  }
}
