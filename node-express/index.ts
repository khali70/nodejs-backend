import { createServer } from "http";
import * as express from "express";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";

const hostname: string = "localhost";
const port: number = 3000;

// TODO Try to use the server with out the ports

const app = express();
app.use(morgan("dev"));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.all("/dishes", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});

app.get("/dishes", (req, res, next) => {
  res.end("Will send all the dishes to you!");
});

app.post("/dishes", (req, res, next) => {
  res.end(
    `Will add the dish: ${req.body.name}\nwith details: ${req.body.description}`
  );
});

app.put("/dishes", (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /dishes");
});

app.delete("/dishes", (req, res, next) => {
  res.end("Deleting all dishes");
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ dish id ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.get("/dishes/:dishId", (req, res, next) => {
  res.end("Will send details of the dish: " + req.params.dishId + " to you!");
});

app.post("/dishes/:dishId", (req, res, next) => {
  res.statusCode = 403;
  res.end("POST operation not supported on /dishes/" + req.params.dishId);
});

app.put("/dishes/:dishId", (req, res, next) => {
  res.write("Updating the dish: " + req.params.dishId + "\n");
  res.end(
    "Will update the dish: " +
      req.body.name +
      " with details: " +
      req.body.description
  );
});

app.delete("/dishes/:dishId", (req, res, next) => {
  res.end("Deleting dish: " + req.params.dishId);
});

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
