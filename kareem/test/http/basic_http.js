const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 3000;

// Dummy data for API
let users = [
  { id: 1, name: "Aaditya" },
  { id: 2, name: "Rohit" }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // -------------------------------
  // 1️⃣ Serve Files from Public Folder
  // -------------------------------
  if (pathname === "/" || pathname.startsWith("/public")) {
    const filePath = pathname === "/"
      ? "./public/index.html"
      : "." + pathname;

    const ext = path.extname(filePath);

    const mimeTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
      ".png": "image/png"
    };

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("File not found");
      } else {
        res.writeHead(200, {
          "Content-Type": mimeTypes[ext] || "text/plain"
        });
        res.end(data);
      }
    });
    return;
  }

  // -------------------------------
  // 2️⃣ Basic GET API
  // -------------------------------
  if (pathname === "/api/users" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
    return;
  }

  // -------------------------------
  // 3️⃣ POST Handling
  // -------------------------------
  if (pathname === "/api/users" && req.method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const newUser = JSON.parse(body);
      users.push(newUser);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User added", users }));
    });
    return;
  }

  // -------------------------------
  // 4️⃣ Query Parameter Handling
  // Example: /search?name=Aaditya
  // -------------------------------
  if (pathname === "/search" && req.method === "GET") {
    const name = parsedUrl.query.name || "Guest";

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`Hello ${name}`);
    return;
  }

  // -------------------------------
  // 5️⃣ Redirect Based on Time
  // -------------------------------
  if (pathname === "/time") {
    const hour = new Date().getHours();

    if (hour < 12) {
      res.writeHead(302, { Location: "/public/index.html" });
    } else {
      res.writeHead(302, { Location: "/api/users" });
    }
    res.end();
    return;
  }

  // -------------------------------
  // 6️⃣ Respond with Different Content Types
  // -------------------------------
  if (pathname === "/content") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "This is JSON response" }));
    return;
  }

  if (pathname === "/text") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("This is plain text");
    return;
  }

  // -------------------------------
  // Default Route
  // -------------------------------
  res.writeHead(404);
  res.end("Route not found");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
