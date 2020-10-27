/**
 *  mongoes schema
 *  the schema consist of
 * {user:userid , _id:id , dishes:[]}
 * verifyuser && req.user._id == user
 *  add to mongo
 *  use population to populate the id of dish
 * $ /favorites get delet post=> arr of dishes add to the arr of dishes
 * favorites/:dishid delete
 */
const { veirfyUser } = require("../auth");
const express = require("express");
const bodyParser = require("body-parser");
const Favorite = require("../model/favorit");
const { corsWithOptions, cors } = require("./CORS");
const favRoute = express.Router();

favRoute.use(bodyParser.json());
// prettier-ignore
favRoute.route("/")
.get(veirfyUser,(req,res,next) => {
  Favorite.find({userid:req.user._id})
  .populate('userid')
  .populate("dishes")
      .then(
        (fav) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(fav);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
})
.post(veirfyUser,(req,res,next) => {
  /**
   * take the body ass arr and push to the arr 
   */
  Favorite.create({userid:req.user._id,dishes:req.body.dishes})
  .then(
    (fav) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(fav);
    },
    (err) => next(err)
  )
  .catch((err) => next(err))
})
.put(veirfyUser, (req, res, next) => {
  /**
   * not allowed
   */
  res.statusCode = 403;
  res.end("PUT operation not supported on /favorites");
})
.delete(veirfyUser,(req,res,next) => {
  // delete all the user favorites 
  Favorite.deleteMany({userid:req.user._id})
  .then((fav) => {
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(fav);
  })
})
// ! not working make it work
favRoute
  .route("/:dishid")
  .get(veirfyUser, (req, res, next) => {
    /* return from fav.dishes.foreach(Obj_of_dish_id=>{
        if(Obj_of_dish_id == req.params.dishid){
          res.statusCode=200;
          res.setHeader("Content-Type","application/json")
          res.json(Obj_of_dish_id)
        }
      })*/
    Favorite.find({ userid: req.user._id })
      .populate("dishes")
      .then((fav) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(fav.dishes);
      })
      .catch((err) => console.log(err));
  })
  .post(veirfyUser, (req, res, next) => {
    /**
     * check the fav add req.params.dishid or create fav the add dishid
     * check if the dish existis first
     */
    // prettier-ignore
    Favorite.findOne({ userid: req.user._id })
    .then((fav) => {
      if(fav !=null){
        if(fav.dishes.indexOf(req.params.dishid) == -1){
          fav.dishes.push(req.params.dishid)
        }else{
          let err = new Error(`this dish is already in the favorites`);
            err.status = 304;
            return next(err);
        }
        fav.save()
        .then(() => {
          Favorite.findOne({userid:req.user._id})
          .then((fav) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(fav);
          })
        })
      }else{
        Favorite.create({userid:req.user._id,dishes:[req.params.dishid]})
        .then(() => {
          Favorite.findOne({userid:req.user._id})
          .then((fav) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(fav);
          })
        })
      }
    });
  })
  .put(veirfyUser, (req, res, next) => {
    /**
     * not allowed
     */
  })
  .delete(veirfyUser, (req, res, next) => {
    /**
     * delete the given dish in the params
     */
    Favorite.findOne({ userid: req.user._id }).then((fav) => {
      if (fav != null) {
        fav.dishes = fav.dishes.filter((dishid) => dishid != req.params.dishid);
        fav.save().then(() => {
          Favorite.findOne({ userid: req.user._id }).then((fav) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(fav);
          });
        });
      } else {
        let err = new Error(
          `this dish ${req.params.dishid} is not in the favorites`
        );
        err.status = 404;
        return next(err);
      }
    });
  });
module.exports = favRoute;
