var express = require("express");
const db = require("../utils/database");
var router = express.Router();
var verifyToken = require("../utils/verify");
require("dotenv").config();
const { body, check, validationResult } = require("express-validator");
var validator = require("validator");

/*Sve narudžbe */

router.get("/all", verifyToken, async (req, res) => {
  //ne smije vozac
  //if (req.authData.user.idUloga === 2) res.status(403).json({ message: "Nije ovlasteno" });
  db.narudzba.findAll().then((narudzbe) => {
    let isporuka = [];
    db.kupac.findAll().then((kupci) => {
      narudzbe.forEach((n) => {
        kupci.forEach((k) => {
          if (n.idKupac == k.id) {
            isporuka.push({ narudzba: n, kupac: k });
            return;
          }
        });
      });
      db.logger.create({ Username: req.authData.user.username, Timestamp: Date.now(), Tabela: "Narudžba", Akcija: "getAll", Odgovor: res.statusCode });
      res.json(isporuka);
    });
  });
});

router.get("/id/:idNarudzba", verifyToken, check("idNarudzba").isNumeric(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const idNarudzba = req.params.idNarudzba;
  db.narudzba.findOne({ where: { id: idNarudzba } }).then((narudzba) => {
    let artikli = [];
    db.kupac.findOne({ where: { id: narudzba.idKupac } }).then((kupac) => {
      db.narudzbaItem.findAll({ where: { idNarudzba: idNarudzba } }).then((items) => {
        db.roba.findAll().then((roba) => {
          items.forEach((i) => {
            roba.forEach((r) => {
              if (r.id == i.idRoba) {
                artikli.push({ naziv: r.Naziv, kolicina: i.Kolicina });
              }
            });
          });
          res.json({ narudzba: narudzba, kupac: kupac, artikli: artikli });
          db.logger.create({ Username: req.authData.user.username, Timestamp: Date.now(), Tabela: "Narudžba", Akcija: "getNarudzbaById", Odgovor: res.statusCode });
        });
      });
    });
  });
});

function isIsoDate(str) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  var d = new Date(str);
  return d.toISOString() === str;
}

router.post("/kreirajNarudzbu", verifyToken, body("idKupac").isNumeric(), async (req, res) => {
  console.log(req.body);
  if (!isIsoDate(req.body.rokIsporuke)) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const temp = req.body.narudzbaItems;
  let nevalja = false;
  temp.forEach((x) => {
    if (typeof x.id !== "number") {
      nevalja = true;
      return;
    }
  });
  if (nevalja) return res.status(400).json({ error: "Invalid narudzba item format" });
  // Ne smije vozac da dodaje
  if (req.authData.user.idUloga === 2) res.status(403).json({ message: "Nije ovlasteno" });
  let rokIsporuke = req.body.rokIsporuke;
  let idKupac = req.body.idKupac;
  let narudzbaItems = req.body.narudzbaItems;
  db.narudzba.create({ RokIsporuke: rokIsporuke, VrijemeNarudzbe: Date.now(), idIsporuka: null, idKupac: idKupac, Status: "Na cekanju" }).then((narudzba) => {
    narudzbaItems.forEach((ni) => {
      db.narudzbaItem.create({ Kolicina: ni.kolicina, idRoba: ni.id, idNarudzba: narudzba.id });
    });
    db.logger.create({ Username: req.authData.user.username, Timestamp: Date.now(), Tabela: "Narudzba", Akcija: "addNarudzba", Odgovor: res.statusCode });
    res.send("ok");
  });
});

router.put("/changeStatus", verifyToken, body("id").isNumeric(), body("razlog").escape(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if (req.body.status !== "Isporučeno" && req.body.status !== "Neuspješno") {
    return res.status(400).json({ error: "Invalid request body" });
  }
  //ne smije uprava
  if (req.authData.user.idUloga === 3) res.status(403).json({ message: "Nije ovlasteno" });
  let id = req.body.id;
  let status = req.body.status;
  let razlog = req.body.razlog;
  db.narudzba.findOne({ where: { id: id } }).then((n) => {
    n.Status = status;
    n.Razlog = razlog;
    n.save();
    res.send("ok");
    db.logger.create({ Username: req.authData.user.username, Timestamp: Date.now(), Tabela: "Narudzba", Akcija: "updateNarudzba", Odgovor: res.statusCode });
  });
  /*db.sequelize.query("Update narudzbas SET Status='"+status+"'WHERE id="+id).then(info=>{
        
        db.logger.create({Username:req.authData.user.username, Timestamp:Date.now(), Tabela:"Narudzba", Akcija:"updateNarudzba", Odgovor: res.statusCode});
    })*/
});

module.exports = router;
