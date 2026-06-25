//server.js que permite correr el frontend en un puerto determinado
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");
const port = Number(process.env.PORT ?? 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((request, response) => {
  const urlPath = decodeURIComponent(request.url?.split("?")[0] ?? "/");
  const requestedPath = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.join(distDir, requestedPath);

  if (!filePath.startsWith(distDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      fs.readFile(path.join(distDir, "index.html"), (indexError, indexContent) => {
        if (indexError) {
          response.writeHead(500);
          response.end("Frontend build not found");
          return;
        }

        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end(indexContent);
      });
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, { "Content-Type": contentTypes[extension] ?? "application/octet-stream" });
    response.end(content);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Frontend disponible en puerto ${port}`);
});
