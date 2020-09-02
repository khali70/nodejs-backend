import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import Dishes from "../model/dishes";

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter
  .route("/")
  .get((req, res, next) => {
    Dishes.find({})
      .then(
        (dishes) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dishes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Dishes.create(req.body)
      .then((dish) => {
        console.log("Dish Created", dish);
        res.statusCode = 200;
        res.json(dish);
      })
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  })
  .delete((req, res, next) => {
    Dishes.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      })
      .catch((err) => next(err));
  });
dishRouter
  .route("/:dishId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /dishes/" + req.params.dishId);
  })
  .put((req, res, next) => {
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      { $set: req.body },
      { new: true }
    )
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      })
      .catch((err) => next(err));
  });
// !------------------------------------------------------ comments -------------------------------------------------------
dishRouter
  .route("/:dishId/comments")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments);
          } else {
            let err: any = new Error(`Dish ${req.params.dishId} not Found`);
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null) {
          dish.comments.push(req.body);
          dish.save().then((dish) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments);
          });
        } else {
          let err: any = new Error(`Dish ${req.params.dishId} not Found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /dishes" + req.params.dishId + "/comments"
    );
  })
  .delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null) {
          if (dish != null) {
            for (var i = dish.comments.length - 1; i >= 0; i--) {
              // @ts-ignore
              dish.comments.id(dish.comments[i]._id).remove(); //FIXME ? dish.comment.id() gives error
              dish.save().then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish.comments);
              });
            }
          } else {
            let err: any = new Error(`Dish ${req.params.dishId} not Found`); //FIXME ? ts 'status' not on type 'Error'.
            err.status = 404;
            return next(err);
          }
        }
      })
      .catch((err) => next(err));
  });
dishRouter
  .route("/:dishId/comments/:commentId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        // @ts-ignore
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          //FIXME ? dish.comment.id() gives error
          dish.comments.push(req.body);
          dish.save().then((dish) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            // @ts-ignore
            res.json(dish.comments.id(req.params.commentId)); //FIXME
          });
        } else if (dish == null) {
          let err: any = new Error(`dish ${req.params.dishId} not Found`);
          err.status = 404;
          return next(err);
        } else {
          let err: any = new Error(`Comment ${req.params.commentId} not Found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /dishes/" +
        req.params.dishId +
        "/comments" +
        req.params.commentId
    );
  })
  .put((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        // @ts-ignore
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          //FIXME ? dish.comment.id() gives error
          if (req.body.rating) {
            // @ts-ignore
            dish.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if (req.body.comment) {
            // @ts-ignore
            dish.comments.id(req.params.commentId).comment = req.body.comment;
          }
          dish.save().then((dish) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            // @ts-ignore
            res.json(dish.comments.id(req.params.commentId)); //FIXME
          });
        } else if (dish == null) {
          let err: any = new Error(`dish ${req.params.dishId} not Found`);
          err.status = 404;
          return next(err);
        } else {
          let err: any = new Error(`Comment ${req.params.commentId} not Found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          // @ts-ignore
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            // @ts-ignore
            dish.comments.id(req.params.commentId).remove();
            dish.save().then(
              (dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              (err) => next(err)
            );
          } else if (dish == null) {
            let err: any = new Error(
              "Dish " + req.params.dishId + " not found"
            );
            err.status = 404;
            return next(err);
          } else {
            let err: any = new Error(
              "Comment " + req.params.commentId + " not found"
            );
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
export default dishRouter;
/* 
{
    "label": "Hot",
    "featured": true,
    "_id": "5f4e430ceec20757258bd68a",
    "name": "Uthappizza",
    "image": "images/uthappizza.png",
    "category": "mains",
    "price": 4.99,
    "description": "A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer.",
    "comments": [
        {
            "_id": "5f4e430ceec20757258bd68b",
            "rating": 5,
            "comment": "Imagine all the eatables, living in conFusion!",
            "author": "John Lemon",
            "createdAt": "2020-09-01T12:48:12.311Z",
            "updatedAt": "2020-09-01T12:48:12.311Z"
        }
    ],
    "createdAt": "2020-09-01T12:48:12.312Z",
    "updatedAt": "2020-09-01T12:48:12.312Z",
    "__v": 0
}
*/
