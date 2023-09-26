const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const Booking = require("./models/Booking.js");
const { default: axios } = require("axios");

require("dotenv").config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "JaiShreeRam";

// Vishal
// HKCLKgeeeVquJw4r
mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.status(200).send("Testing");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    return res.status(201).json(newUser);
  } catch (error) {
    res.status(422).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await User.findOne({ email });

  if (result) {
    // Checking password from database
    const passOk = bcrypt.compareSync(password, result.password);

    if (passOk) {
      // Creating token
      jwt.sign(
        { email: result.email, id: result._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(result);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.status(404).json("User not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;

      const { name, email, id } = await User.findById(userData.id);
      res.json({ name, email, id });
    });
  } else {
    res.json(null);
  }
});

// logout Post
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("Successfully Logout");
});

// Upload Photo using link
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";

  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });

  res.json(newName);
});

// middleware
const upload = multer({ dest: "uploads/" });
// Upload Photo Using Local Files
app.post("/upload", upload.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    let newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

// Taking form data and Adding new place to my accomodation
app.post("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    photos: addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(placeDoc);
  });
});

// Sending User Places
app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

// Updating data if already present
app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    const placeDoc = await Place.findById(id);

    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

// Get Request to access Places
app.get("/places", async (req, res) => {
  res.json(await Place.find({}));
});

// Booking Route
app.post("/bookings", async (req, res) => {
  const userData = await getUserDatFromToken(req);
  const { place, checkIn, checkOut, numberOfGuests, name, phone } = req.body;

  Booking.create({
    user: userData.id,
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
  })
    .then((doc) => {
      res.json(doc);
      // res.json("Booking Successfull");
    })
    .catch((err) => {
      console.log(err);
    });
});

// User Booking Route
app.get("/bookings", async (req, res) => {
  const userData = await getUserDatFromToken(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

// Function to extract token from cookies
function getUserDatFromToken(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.listen(4000, () => {
  console.log("Server is up and running");
});
