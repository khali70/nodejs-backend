const express = require("express");
const bodyParser = require("body-parser");
const { veirfyUser, verifyAdmin } = require("../auth");
const { corsWithOptions, cors } = require("./CORS");

// configuer express route
const uploadRouter = express.Router();
// config body parser
uploadRouter.use(bodyParser.json());
// adding mullter to upload the img
const multer = require("multer");

// where to store the data and the file name of the stored data
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// validate that the uploaded file is img
/**
 * validate the the sended file is img
 * @param {req} req the request
 * @param {Express.Multer.File} file the file
 * @param {multer.FileFilterCallback} cb the result from all that 3k in the function
 * @returns `true` if the file is img
 */
const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("You can upload only image files!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

uploadRouter
  .route("/")
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, veirfyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("GET operation not supported on /imageUpload");
  })
  .post(corsWithOptions, veirfyUser, upload.single("imageFile"), (req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(req.file);
  })
  .put(corsWithOptions, veirfyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /imageUpload");
  })
  .delete(corsWithOptions, veirfyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("DELETE operation not supported on /imageUpload");
  });

module.exports = uploadRouter;
