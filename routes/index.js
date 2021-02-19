var express = require("express");
require("dotenv").config();
var router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../utils/database");
var Kodiranje = require("../utils/kodiranje");
var verifyToken = require("../utils/verify");
const { body, check, validationResult } = require("express-validator");
var validator = require("validator");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", body("username").escape(), body("password").escape(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let kodiranje = new Kodiranje();
  var username = req.body.username;
  var password = req.body.password;

  db.korisnik.findOne({ where: { Username: username } }).then((korisnik) => {
    if (korisnik) {
      //provjera timeouta
      if (!tryToLogin(username)) {
        res.status(403).send({ message: "Unijeli ste pogrešne podatke. Molimo sačekajte prije sljedećeg pokušaja." });
        return;
      }
      var user = { id: korisnik.id, username: korisnik.Username, idUloga: korisnik.idUloga };
      kodiranje.porediPassword(password, korisnik.Password).then((same) => {
        if (same) {
          onLoginSuccess(username);
          db.refreshtoken.findOne({ where: { userId: korisnik.id } }).then((result) => {
            if (result) {
              db.refreshtoken.destroy({ where: { userId: korisnik.id } }).then(() => {
                jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" }, (err, token) => {
                  jwt.sign({ user: user }, process.env.REFRESH_TOKEN_SECRET, (err2, rt) => {
                    db.refreshtoken.create({ userId: korisnik.id, refreshToken: rt });
                    res.json({ token: token, refresh_token: rt, idUloga: korisnik.idUloga, idKorisnik: korisnik.id });
                  });
                });
              });
            } else {
              jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" }, (err, token) => {
                jwt.sign({ user: user }, process.env.REFRESH_TOKEN_SECRET, (err2, rt) => {
                  db.refreshtoken.create({ userId: korisnik.id, refreshToken: rt });
                  res.json({ token: token, refresh_token: rt, idUloga: korisnik.idUloga, idKorisnik: korisnik.id });
                });
              });
            }
          });
        } else {
          onLoginFail(username);
          res.status(403).send({ message: "Pogrešni pristupni podaci" });
        }
      });
    } else {
      res.status(403).send({ message: "Pogrešni pristupni podaci" });
    }
  });
});

router.post("/token", (req, res) => {
  if (!validator.isJWT(req.body["token"])) {
    return res.status(400).json({ error: "Invalid token format" });
  }

  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  db.refreshtoken.findOne({ where: { refreshToken: refreshToken } }).then((result, err) => {
    if (err) {
      res.sendStatus(404);
    }
    if (result) {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err2, korisnik) => {
        if (err2) return res.sendStatus(403);
        jwt.sign({ user: korisnik }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" }, (err3, token) => {
          res.json({ token: token });
        });
      });
    } else {
      res.sendStatus(404);
    }
  });
});

router.delete("/logout", (req, res) => {
  if (!validator.isJWT(req.body["token"])) {
    return res.status(400).json({ error: "Invalid token format" });
  }
  db.refreshtoken.destroy({ where: { refreshToken: req.body.token } }).then(function (deletedRecord) {
    if (deletedRecord === 1) {
      res.status(200).json({ message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "record not found" });
    }
  });
});

//funkcije za brute force passworda
var failures = {};
function tryToLogin(username) {
  var f = failures[username];
  if (f && Date.now() < f.nextTry) {
    // Throttled. Can't try yet.
    return false;
  }
  return true;
  // Otherwise do login
}

function onLoginFail(username) {
  var f = (failures[username] = failures[username] || { count: 0, nextTry: new Date() });
  ++f.count;
  f.nextTry.setTime(Date.now() + 2000 * f.count); // Wait another two seconds for every failed attempt
}

function onLoginSuccess(username) {
  delete failures[username];
}

// Clean up people that have given up
var MINS1 = 60000,
  MINS3 = 3 * MINS1;
setInterval(function () {
  for (var user in failures) {
    if (Date.now() - failures[user].nextTry > MINS1) {
      delete failures[user];
    }
  }
}, MINS3);

module.exports = router;
