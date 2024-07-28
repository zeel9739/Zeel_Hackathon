const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cloudinary = require("../utils/cloudinary");
// const upload = require("../utils/multer");

const Playlist = require("../models/playlist");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/playlistImg");
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

router.post(
  "/post/playlist/:channelid",
  upload.single("photo"),
  (req, res, next) => {
    try {
      const playlist = new Playlist({
        _id: new mongoose.Types.ObjectId(),
        channel: req.params.channelid,
        name: req.body.name,
        recipes: JSON.parse(req.body.recipesid),
        photo: `http://localhost:3004/${req.file.path}`,
      });
      playlist
        .save()
        .then((result) => {
          // console.log(result);
          return res.status(201).json({
            message: "handling post request in /playlist",
            createdPlaylist: result,
          });
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
  }
);

router.get("/get/AllPlaylist/:channelid", (req, res, next) => {
  Playlist.find({ channel: req.params.channelid })
    //TODO set limit
    .select(" name photo recipes time ")
    .populate("recipes", ["rname", "Rpic"])
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        playlist: docs,
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

//don't needed now
router.get("/:playlistId", (req, res, next) => {
  const id = req.params.playlistId;
  Playlist.findById(id)
    .select(" name photo recipes time ")
    .populate("recipes", ["rname", "Rpic"])
    .exec()
    .then((playlist) => {
      if (!playlist) {
        return res.status(404).json({
          message: "Playlist not found",
        });
      }
      res.status(200).json({
        Playlist: playlist,
        request: {
          type: "GET",
          url: "http://localhost:3000/comment",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.put(
  "/update/Playlist/:playlistid",
  upload.single("photo"),
  async (req, res) => {
    try {
      let playlist = await Playlist.findById(req.params.playlistid);
      // await cloudinary.uploader.destroy(playlist.cloudinary_id);
      // const result = await cloudinary.uploader.upload(req.file.path);
      const data = {
        name: req.body.name || playlist.name,
        recipes: req.body.recipesid || playlist.recipesid,
        photo: playlist.photo,
      };
      playlist = await Playlist.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });
      res.json(playlist);
    } catch (err) {
      console.log(err);
    }
  }
);

router.delete("/delete/Playlist/:playlistId", (req, res, next) => {
  const id = req.params.playlistId;
  Playlist.deleteOne({ _id: id })
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
