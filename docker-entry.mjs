/**
 * Docker/Easypanel entry point.
 *
 * The TanStack Start build outputs a Web-Standard fetch handler
 * (export default { fetch(request) → Response }).
 * This script bridges it to a plain Node.js HTTP server so it can
 * run inside a Docker container.
 *
 * It also serves static files from dist/client/ for client-side assets.
 */
import { createServer } from "node:http";
import { Readable } from "node:stream";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";

// Dynamic import so the path is resolved at runtime (matches the build output).
const { default: app } = await import("./dist/server/server.js");

const CLIENT_DIR = join(__dirname, "dist", "client");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

/**
 * Try to serve a static file from dist/client/.
 * Returns true if the file was served, false otherwise.
 */
async function tryServeStatic(req, res) {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  let filePath = join(CLIENT_DIR, decodeURIComponent(url.pathname));

  // Prevent directory traversal
  if (!filePath.startsWith(CLIENT_DIR)) return false;

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) return false;

    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const data = await readFile(filePath);

    const headers = {
      "content-type": contentType,
      "content-length": data.byteLength.toString(),
    };

    // Immutable cache for hashed assets (e.g. assets/index-CiovhTKW.js)
    if (url.pathname.startsWith("/assets/")) {
      headers["cache-control"] = "public, max-age=31536000, immutable";
    }

    res.writeHead(200, headers);
    res.end(data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert a Node.js IncomingMessage into a Web Standards Request.
 */
function toWebRequest(req) {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["host"] || `${HOST}:${PORT}`;
  const url = new URL(req.url, `${protocol}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody ? Readable.toWeb(req) : undefined;

  return new Request(url.href, {
    method: req.method,
    headers,
    body,
    duplex: hasBody ? "half" : undefined,
  });
}

/**
 * Pipe a Web Standards Response back into a Node.js ServerResponse.
 */
async function sendWebResponse(webRes, res) {
  res.writeHead(webRes.status, Object.fromEntries(webRes.headers.entries()));

  if (!webRes.body) {
    res.end();
    return;
  }

  // Stream the body
  const reader = webRes.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  } finally {
    res.end();
  }
}

const server = createServer(async (req, res) => {
  try {
    // Try static files first (client assets: JS, CSS, images, etc.)
    if (req.method === "GET" || req.method === "HEAD") {
      const served = await tryServeStatic(req, res);
      if (served) return;
    }

    // Fall through to SSR handler
    const webRequest = toWebRequest(req);
    const webResponse = await app.fetch(webRequest, {}, {});
    await sendWebResponse(webResponse, res);
  } catch (err) {
    console.error("Unhandled server error:", err);
    if (!res.headersSent) {
      res.writeHead(500, { "content-type": "text/plain" });
    }
    res.end("Internal Server Error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server listening on http://${HOST}:${PORT}`);
});
