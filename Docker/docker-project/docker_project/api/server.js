const http = require("http");

const port = 3000;

const server = http.createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");

  if (request.url === "/api/message" && request.method === "GET") {
    response.writeHead(200);
    response.end(
      JSON.stringify({
        message: "Hello from the API container!",
        lesson: "The frontend reached this API through a Docker network."
      })
    );
    return;
  }

  if (request.url === "/health" && request.method === "GET") {
    response.writeHead(200);
    response.end(JSON.stringify({ status: "healthy" }));
    return;
  }

  response.writeHead(404);
  response.end(JSON.stringify({ error: "Route not found" }));
});

server.listen(port, "0.0.0.0", () => {
  console.log(`API is listening on port ${port}`);
});
