/* WISH
 * mongoos => make a sckema
 * dotenv => to hide senstive data
 */
import { MongoClient } from "mongodb";
import * as assert from "assert";

const url = "mongodb://localhost:2020";
const dbname = "conFusion";
MongoClient.connect(url, (err, client) => {
  assert.equal(err, null);
  console.log(`Connected to the server \n`);
  const db = client.db(dbname);
  const collection = db.collection("dishes");
  collection.insertOne(
    { name: "Uthappizza", description: "test" },
    (err, result) => {
      assert.equal(err, null);
      console.log(`After Insert: \n`);
      console.log(result.ops);

      collection.find({}).toArray((err, docs) => {
        assert.equal(err, null);
        console.log("Found:\n");
        console.log(docs);
        db.dropCollection("dishes", (err, result) => {
          assert.equal(err, null);
          client.close();
        });
      });
    }
  );
});
console.log("Hello from index");
