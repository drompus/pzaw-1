import { createServer } from "node:http";
import { URL } from "node:url";
import { handlePath } from "./src/path_handlers.js";

// Create a HTTP server
const server = createServer((req, res) => {
  const request_url = new URL(`http://${host}${req.url}`);
  console.log(`Request: ${req.method} ${request_url.pathname}`);

  handlePath(request_url.pathname, req, res);

  if (!res.writableEnded) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Site not found!\n");
  }
});

const port = 8000;
const host = "localhost";

// Start the server
server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});