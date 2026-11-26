const encoder = new TextEncoder();

export async function onRequest({ request, env, next }) {
  const path = new URL(request.url).pathname;
  if (path !== "/admin" && !path.startsWith("/admin/")) return next();

  const headers = { "Cache-Control": "private, no-store" };

  if (!env.ADMIN_PASSCODE || env.ADMIN_PASSCODE.length < 16) {
    return new Response("Admin sign-in is unavailable.", { status: 503, headers });
  }

  const credentials = request.headers.get("Authorization") ?? "";
  if (!(await isAuthorized(credentials, env.ADMIN_PASSCODE))) {
    headers["WWW-Authenticate"] = 'Basic realm="Portfolio admin", charset="UTF-8"';
    return new Response("Admin sign-in required.", { status: 401, headers });
  }

  const response = new Response(await next());
  response.headers.set("Cache-Control", headers["Cache-Control"]);
  return response;
}

async function isAuthorized(header, passcode) {
  const match = /^Basic ([A-Za-z0-9+/=]+)$/i.exec(header);
  if (!match || match[1].length > 1024) return false;

  let supplied;
  try {
    supplied = Uint8Array.from(atob(match[1]), character => character.charCodeAt(0));
  } catch {
    return false;
  }

  const expected = encoder.encode(`admin:${passcode}`);
  const [actualDigest, expectedDigest] = await Promise.all([
    crypto.subtle.digest("SHA-256", supplied),
    crypto.subtle.digest("SHA-256", expected),
  ]);
  return crypto.subtle.timingSafeEqual(actualDigest, expectedDigest);
}
