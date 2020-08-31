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
  collection: collection
) => {
  const coll = db.collection(collection);
  return coll.insert(document);
};
export const findDocuments = (db: Db, collection: collection) => {
  const coll = db.collection(collection);
  return coll.find({}).toArray();
};
export const removeDocument = (
  db: Db,
  document: document,
  collection: collection
) => {
  const coll = db.collection(collection);
  return coll.deleteOne(document);
};
export const updateDocument = (
  db: Db,
  document: document,
  update: document,
  collection: collection
): any => {
  const coll = db.collection(collection);
  return coll.updateOne(document, { $set: update }, null);
};
