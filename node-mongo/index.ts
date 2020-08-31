/* WISH
 * mongoos => make a sckema
 * dotenv => to hide senstive data
 */
import { MongoClient } from "mongodb";
import * as assert from "assert";
import * as dboper from "./operations";

const url = "mongodb://localhost:2020";
const dbname = "conFusion";
MongoClient.connect(url, (err, client) => {
  assert.equal(err, null);
  console.log(`Connected to the server \n`);
  const db = client.db(dbname);
  const collection = db.collection("dishes");
  dboper.insertDocument(
    db,
    { name: "Vadonut", description: "test" },
    "dishes",
    (result) => {
      console.log("inserted:\n", result.ops);
      dboper.findDocument(db, "dishes", (docs) => {
        console.log("Fond Documents:\n", docs);
        dboper.updateDocument(
          db,
          { name: "Vadonut" },
          { description: "Updated Test" },
          "dishes",
          (result) => {
            console.log("Updated Document:\n", result.result);
            dboper.findDocument(db, "dishes", (docs) => {
              console.log("Fond Documents:\n", docs);
              db.dropCollection("dishes", (result) => {
                console.log("Droped Collection:", result);
                client.close();
              });
            });
          }
        );
      });
    }
  );
});
console.log("Hello from index");
