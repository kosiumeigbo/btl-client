import express from "express";
import type { Request, Response, Application } from "express";
import path from "path";

const hostname = "127.0.0.1";
const port = 3000;

const app: Application = express();

app.get("/*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "..", "index.html"));
});

app.use("/", express.static(path.join(__dirname)));

// listen for request on port 3000
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
