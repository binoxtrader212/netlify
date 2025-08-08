// Netlify Edge middleware to require Supabase session
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

export default async (request, context) => {
  const url = new URL(request.url);

  // allow login and static assets without session
  if (url.pathname.startsWith("/login") || url.pathname.startsWith("/favicon") || url.pathname.startsWith("/assets")) {
    return context.next();
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { "x-forwarded-host": url.host } },
    cookies: {
      get: (key) => context.cookies.get(key),
      set: () => {},
      remove: () => {},
    },
  });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("redirect", url.pathname);
    return Response.redirect(loginUrl, 302);
  }

  return context.next();
};

export const config = {
  path: ["/", "/app/*"],
};
