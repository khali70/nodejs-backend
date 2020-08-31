import * as assert from "assert";
import { Db } from "mongodb";
/*  
  // update the collection type string to 'dishes','leader' comments  poromotion ... etc
  //  line 14 the type the same as line 16
*/
type comment = {
  comment: string;
  author: string;
  date: Date | string;
  rating: 1 | 2 | 3 | 4 | 5;
};
type collection = "dishes" | "leader" | "comments" | "poromotion";
type dish = {
  name: string;
  description?: string;
  price: number;
  comments: comment[];
  label: "New" | "Old" | "" | "Hot";
  featured: boolean;
  category: string;
  image: string;
};
type leader = {
  name: string;
  designation?: string;
  featured: boolean;
  image: string;
  abbr?: string;
};

type document = dish | leader;
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
