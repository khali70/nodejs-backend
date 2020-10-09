const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Dishes = require("../model/dishes");
const { veirfyUser } = require("../auth");
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter
  .route("/")
  .get((req, res, next) => {
    Dishes.find({})
      .populate("comments.author")
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
  .post(veirfyUser, (req, res, next) => {
    Dishes.create(req.body)
      .then((dish) => {
        console.log("Dish Created", dish);
        res.statusCode = 200;
        res.json(dish);
      })
      .catch((err) => next(err));
  })
  .put(veirfyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  })
  .delete(veirfyUser, (req, res, next) => {
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
      .populate("comments.author")
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      })
      .catch((err) => next(err));
  })
  .post(veirfyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /dishes/" + req.params.dishId);
  })
  .put(veirfyUser, (req, res, next) => {
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
  .delete(veirfyUser, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      })
      .catch((err) => next(err));
  });
// ------------------------------------------------------ comments -------------------------------------------------------
dishRouter
  .route("/:dishId/comments")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .populate("comments.author")
      .then(
        (dish) => {
          if (dish != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments);
          } else {
            let err = new Error(`Dish ${req.params.dishId} not Found`);
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(veirfyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null) {
          req.body.author = req.user._id;
          dish.comments.push(req.body);
          dish.save().then(
            (dish) => {
              Dishes.findById(dish._id)
                .populate("comments.author")
                .then((dish) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(dish.comments);
                });
            },
            (err) => console.log(err)
          );
        } else {
          let err = new Error(`Dish ${req.params.dishId} not Found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put(veirfyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /dishes" + req.params.dishId + "/comments"
    );
  })
  .delete(veirfyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null) {
          if (dish != null) {
            for (var i = dish.comments.length - 1; i >= 0; i--) {
              dish.comments.id(dish.comments[i]._id).remove();
              dish.save().then((dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish.comments);
              });
            }
          } else {
            let err = new Error(`Dish ${req.params.dishId} not Found`);
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
      .populate("comments.author")
      .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          dish.comments.push(req.body);
          dish.save().then((dish) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments.id(req.params.commentId));
          });
        } else if (dish == null) {
          let err = new Error(`dish ${req.params.dishId} not Found`);
          err.status = 404;
          return next(err);
        } else {
          let err = new Error(`Comment ${req.params.commentId} not Found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(veirfyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /dishes/" +
        req.params.dishId +
        "/comments" +
        req.params.commentId
    );
  })
  .put(veirfyUser, (req, res, next) => {
    // TODO: only the comment owner can put the comment
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
          if (req.body.rating) {
            dish.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if (req.body.comment) {
            dish.comments.id(req.params.commentId).comment = req.body.comment;
          }
          dish.save().then((dish) => {
            Dishes.findById(dish._id)
              .populate("comments.author")
              .then((params) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish.comments.id(req.params.commentId));
              });
          });
        } else if (dish == null) {
          let err = new Error(`dish ${req.params.dishId} not Found`);
          err.status = 404;
          return next(err);
        } else {
          let err = new Error(`Comment ${req.params.commentId} not Found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete(veirfyUser, (req, res, next) => {
    // TODO: only the comment owner can delete the comment
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save().then(
              (dish) => {
                Dishes.findById(dish._id)
                  .populate("comments.author")
                  .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dish);
                  });
              },
              (err) => next(err)
            );
          } else if (dish == null) {
            let err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          } else {
            let err = new Error(
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
module.exports = dishRouter;
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
