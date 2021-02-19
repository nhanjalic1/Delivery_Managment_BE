var express = require("express");
const db = require("../utils/database");
const verifyToken = require("../utils/verify");
var router = express.Router();
var Kodiranje = require("../utils/kodiranje");
const { body, check, validationResult } = require("express-validator");
var validator = require("validator");

const kodiranje = new Kodiranje();
/* GET users listing. */
router.get("/", async (req, res) => {
  const users = await db.uloga.findAll();
  res.send("respond with a resource");
});
router.post("/user", verifyToken, body("username").escape(), body("ime").escape(), body("prezime").escape(), body("idUloga").isNumeric(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (req.authData.user.idUloga != 1) res.status(403).json({ message: "Nije ovlasteno" });
  let username = req.body.username;
  let password = await kodiranje.kodirajPassword(req.body.password);
  let ime = req.body.ime;
  let prezime = req.body.prezime;
  let idUloga = req.body.idUloga;

  let nevalja = false;
  db.korisnik.findAll().then((korisnici) => {
    korisnici.forEach((k) => {
      if (k.Username == username) {
        console.log("ima hule");
        nevalja = true;
      }
    });
    if (nevalja) {
      return res.status(400).json({ message: "Korisničko ime već postoji" }).end();
    }
    db.korisnik.create({ Username: username, Password: password, Ime: ime, Prezime: prezime, idUloga: idUloga }, (fields = ["Username", "Password", "Ime", "Prezime", "idUloga"])).then((rezultat) => {
      db.logger.create({ Username: req.authData.user.username, Timestamp: Date.now(), Tabela: "Korisnik", Akcija: "addKorisnik", Odgovor: res.statusCode });
      res.send("ok");
    });
  });
});

module.exports = router;
