// Echo server for the community/google-forms tests.
// Usage: node mock-echo.js <port>
//
// It answers every request with a JSON document describing the request aux4
// built — method, path, Authorization header, Content-Type header and parsed
// body — so the tests can assert the exact shape without a real Google Form.
//
// Node is used instead of Python because Python 3.14's http.server leaves its
// listening socket unreachable on the macos-latest CI runner.

const http = require("http");

const port = parseInt(process.argv[2], 10);

// Self-destruct so a stray server never outlives the test run.
setTimeout(() => process.exit(0), 90000);

const server = http.createServer((req, res) => {
  const chunks = [];
  req.on("data", c => chunks.push(c));
  req.on("end", () => {
    const raw = Buffer.concat(chunks).toString();
    let body = null;
    if (raw) {
      try {
        body = JSON.parse(raw);
      } catch (e) {
        body = raw;
      }
    }
    const payload = {
      method: req.method,
      path: req.url,
      authorization: req.headers["authorization"] || null,
      contentType: req.headers["content-type"] || null,
      body: body
    };
    const data = JSON.stringify(payload, null, 2);
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data)
    });
    res.end(data);
  });
});

server.listen(port);
