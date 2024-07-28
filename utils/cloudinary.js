const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "recipely2022",
    api_key: "411659788994315",
    api_secret: "BUyX3Ys09QowTNWQI3NnUsQ8VRE",
    secure: true,
  });

module.exports = cloudinary;