import { createServer } from "http";
import * as express from "express";
import * as morgan from "morgan";

const hostname: string = "localhost";
const port: number = 3000;
// TODO Try to use the server with out the ports

const app = express();
app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.use((req, res, next) => {
  console.log(req.headers);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(`<html><body><h1>This is as Express Server</h1></body></html>`);
});
const server = createServer(app);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
