const { veirfyUser } = require("../auth");
const express = require("express");
const bodyParser = require("body-parser");
const Favorite = require("../model/favorit");
const { corsWithOptions, cors } = require("./CORS");
const favRoute = express.Router();

favRoute.use(bodyParser.json());
// prettier-ignore
favRoute.route("/")
.options(corsWithOptions, (req, res) => {
  res.sendStatus(200);
})
.get(cors,veirfyUser,(req,res,next) => {
  Favorite.findOne({userid:req.user._id})
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
.post(corsWithOptions,veirfyUser,(req,res,next) => {
  /**
   * take the body ass arr and push to the arr 
   */
  Favorite.findOne({userid:req.user._id})
  .populate("userid")
  .populate("dishes")
  .then((fav) => {
    if(fav==null){
      Favorite.create({userid:req.user._id,dishes:req.body.dishes})
      .populate("userid")
      .populate("dishes")
      .then(
        (fav) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(fav);
        },
        (err) => next(err)
      )
    }else{
      req.body.forEach((dishid) => {
        if (fav.dishes.indexOf(dishid) < 0)
          fav.dishes.push(dishid);
      });
      fav.save().then((fav) => {
        // find the dish
        Favorite.findById(fav._id)
          .populate("userid")
          .populate("dishes")
          .then((fav) => {
            if (fav == null) {
              let err = new Error("adding the dish falied");
              err.status = 404;
              throw err;
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(fav);
            }
          });
          // end of find the dish
      })
    }
  })
  .catch((err) => next(err))
})
.put(corsWithOptions,veirfyUser, (req, res, next) => {
  /**
   * not allowed
   */
  res.statusCode = 403;
  res.end("PUT operation not supported on /favorites");
})
.delete(corsWithOptions,veirfyUser,(req,res,next) => {
  // delete all the user favorites 
  Favorite.deleteMany({userid:req.user._id})
  .then((fav) => {
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(fav);
  })
})
// FIXME check the code fisrt
// favRoute
//   .route("/:favId")
//   .options(corsWithOptions, (req, res) => {
//     res.sendStatus(200);
//   })
//   .get(corsWithOptions, veirfyUser, (req, res, next) => {
//     Favorite.findOne({ userid: req.user._id })
//       .populate("userid")
//       .populate("dishes")
//       .then((fav) => {
//         if (!fav) {
//           res.statusCode = 200;
//           res.setHeader("Content-Type", "application/json");
//           return res.json({ exists: false, favorites: null });
//         } else if (fav.dishes.indexOf(req.params.dishid) < 0) {
//           res.statusCode = 200;
//           res.setHeader("Content-Type", "application/json");
//           return res.json({ exists: false, favorites: null });
//         } else {
//           res.statusCode = 200;
//           res.setHeader("Content-Type", "application/json");
//           return res.json({ exists: true, favorites: fav });
//         }
//       })
//       .catch((err) => console.log(err));
//   })
//   .post(corsWithOptions, veirfyUser, (req, res, next) => {
//     /**
//      * check the fav add req.params.dishid or create fav the add dishid
//      * check if the dish existis first
//      */
//     // prettier-ignore
//     Favorite.findOne({ userid: req.user._id })
//     .populate("userid")
//     .populate("dishes")
//     .then((fav) => {
//       if(fav !=null){
//         if(fav.dishes.indexOf(req.params.dishid) < 0){
//           fav.dishes.push(req.params.dishid)
//         }else{
//           let err = new Error(`this dish is already in the favorites`);
//             err.status = 304;
//             return next(err);
//         }
//         fav.save()
//         .then(() => {
//           Favorite.findOne({userid:req.user._id})
//           .populate("userid")
//           .populate("dishes")
//           .then((fav) => {
//             res.statusCode = 200;
//             res.setHeader("Content-Type", "application/json");
//             return res.json(fav);
//           })
//         })
//       }else{
//         Favorite.create({userid:req.user._id,dishes:[req.params.dishid]})
//         .populate("userid")
//         .populate("dishes")
//         .then(() => {
//           Favorite.findOne({userid:req.user._id})
//           .then((fav) => {
//             res.statusCode = 200;
//             res.setHeader("Content-Type", "application/json");
//             return res.json(fav);
//           })
//         })
//       }
//     });
//   })
//   .put(veirfyUser, (req, res, next) => {
//     /**
//      * not allowed
//      */
//   })
//   .delete(corsWithOptions, veirfyUser, (req, res, next) => {
//     /**
//      * delete the given dish in the params
//      */
//     Favorite.findOne({ userid: req.user._id }).then((fav) => {
//       if (fav != null) {
//         fav.dishes = fav.dishes.filter((dishid) => dishid != req.params.dishid);
//         fav.save().then(() => {
//           Favorite.findOne({ userid: req.user._id })
//             .populate("userid")
//             .populate("dishes")
//             .then((fav) => {
//               res.statusCode = 200;
//               res.setHeader("Content-Type", "application/json");
//               return res.json(fav);
//             });
//         });
//       } else {
//         let err = new Error(
//           `this dish ${req.params.dishid} is not in the favorites`
//         );
//         err.status = 404;
//         return next(err);
//       }
//     });
//   });
module.exports = favRoute;
