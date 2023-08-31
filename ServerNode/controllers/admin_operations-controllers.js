const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt"); //pass encryption
const jwt = require("jsonwebtoken"); //token

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Admin = require("../models/admin");
const Place = require("../models/place");
const BidJunctionTable = require("../models/bidding");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  console.log(email,password);
  let existingUser;
  try {
    existingUser = await Admin.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing in failed.", 500);
    return next(error);
  }

  if (!existingUser) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        500
      )
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }
  //const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  //if (!identifiedUser || identifiedUser.password !== password) {
  // throw new HttpError(
  // "Could not identify user, credentials seem to be wrong.",
  //401
  // );
  // }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "private_key",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Log in failed, please try again later.", 500);
    console.log(err);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};


const createDummyAdmin = async () => {
    const dummyAdmin = new Admin({
      name: "Dummy Admin",
      email: "dummy@example.com",
      password: await bcrypt.hash("dummy123", 10), // Hashed password
    });
  
    try {
      await dummyAdmin.save();
      console.log("Dummy admin created:", dummyAdmin);
    } catch (error) {
      console.error("Error creating dummy admin:", error);
    
  };
}
  //createDummyAdmin();

const getAdmins = async () => {
    try {
      const admins = await Admin.find();
      console.log("Admins:", admins);
      res.status(200).json({ admins: admins });
    } catch (err) {
      const error = new HttpError("Fetching admins failed.", 500);
      
    }
  };

getAdmins();

exports.login = login;
