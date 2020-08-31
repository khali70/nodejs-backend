import * as assert from "assert";
import {
  Db,
  InsertWriteOpResult,
  DeleteWriteOpResultObject,
  UpdateWriteOpResult,
} from "mongodb";
/*TODO
  DONE update the collection type string to 'dishes','leader' comments  poromotion ... etc
  TIP - line 14 the type the same as line 16
*/
type collection = "dishes" | "leader" | "comments" | "poromotion";
type document = {
  date?: Date | string;
  author?: string;
  comment?: string;
  rating?: number;
  dishId?: any;
  name?: string;
  image?: string;
  label?: "New" | "Old" | "" | "Hot";
  price?: number;
  featured?: boolean;
  description?: string;
  designation?: string;
  abbr?: string;
  category?: string;
};
export const insertDocument = (
  db: Db,
  document: document,
  collection: collection,
  callback?: (
    result: InsertWriteOpResult<{ name: string; description: string; _id: any }>
  ) => any
) => {
  const coll = db.collection(collection);
  coll.insert(document, (err, result) => {
    assert.equal(err, null);
    console.log(
      `Inserted ${result.result.n} documents into the collection ${collection}`
    );
    callback(result);
  });
};
export const findDocument = (
  db: Db,
  collection: collection,
  callback?: (docs: any[]) => any
) => {
  const coll = db.collection(collection);
  coll.find({}).toArray((err, docs) => {
    assert.equal(err, null);
    callback(docs);
  });
};
export const removeDocument = (
  db: Db,
  document: document,
  collection: collection,
  callback?: (result: DeleteWriteOpResultObject) => any
) => {
  const coll = db.collection(collection);
  coll.deleteOne(document, (err, result) => {
    assert.equal(err, null);
    console.log(`Removed the document`, document);
    callback(result);
  });
};
export const updateDocument = (
  db: Db,
  document: document,
  update: document,
  collection: collection,
  callback?: (result: UpdateWriteOpResult) => any
) => {
  const coll = db.collection(collection);
  coll.updateOne(document, { $set: update }, null, (err, result) => {
    assert.equal(err, null);
    console.log(`Updated the document with `, update);
    callback(result);
  });
};
