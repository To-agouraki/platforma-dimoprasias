const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt"); //pass encryption
const jwt = require("jsonwebtoken"); //token

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Place = require("../models/place");
const BidJunctionTable = require("../models/bidding");