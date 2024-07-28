const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cloudinary = require("../utils/cloudinary");
// const upload = require('../utils/multer');

const Category = require("../models/category");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/categoryImg");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post("/post/category", upload.single("photo"), (req, res, next) => {
  try {
    // const result = await cloudinary.uploader.upload(req.file.path);
    const category = new Category({
      _id: mongoose.Types.ObjectId(),
      name: req.body.name,
      photo: `http://localhost:3004/${req.file.path}`,
    });
    category
      .save()
      .then((result) => {
        const response = {
          message: "handling post request in /Category",
          createdCategory: result,
        };
        return res.status(200).json(response);
      })
      .catch((err) => {
        // console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  } catch (e) {
    res.status(500).json({
      message: "internal server error",
      error: e,
    });
  }
});

router.get("/getAll/category", (req, res, next) => {
  Category.find()
    //TODO set limit
    .select("name photo")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        category: docs,
      };
      return res.status(200).json(response);
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/getonecategory/:categoryId", (req, res, next) => {
  const id = req.params.categoryId;
  Category.findById(id)
    .select("name photo")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        category: docs,
      };
      return res.status(200).json(response);
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/deletecategory/:categoryid", async (req, res, next) => {
  const id = req.params.categoryid;
  Category.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
