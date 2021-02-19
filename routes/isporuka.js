var express = require("express");
const db = require("../utils/database");
var router = express.Router();
var verifyToken = require("../utils/verify");
const { body, check, validationResult } = require("express-validator");

router.get("/id/:idVozac", verifyToken, check("idVozac").isNumeric(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const idVozac = req.params.idVozac;
  db.vozilo.findOne({ where: { idKorisnik: idVozac } }).then((v) => {
    db.isporuka.findOne({ where: { idVozilo: v.id } }).then((i) => {
      db.narudzba.findAll({ where: { idIsporuka: i.id } }).then((narudzbe) => {
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
          res.json(isporuka);
          db.logger.create({ Username: req.authData.user.username, Timestamp: Date.now(), Tabela: "Isporuka", Akcija: "GetIsporukaById", Odgovor: res.statusCode });
        });
      });
    });
  });
});
router.get("/all", verifyToken, async function (req, res) {
  db.isporuka.findAll().then((isporuke) => {
    db.vozilo.findAll().then((vozila) => {
      db.korisnik.findAll().then((korisnici) => {
        let nizIsporuka = [];
        isporuke.forEach((i) => {
          vozila.forEach((v) => {
            if (i.idVozilo == v.id) {
              korisnici.forEach((k) => {
                if (k.id == v.idKorisnik) {
                  nizIsporuka.push({ korisnik: k, vozilo: v, isporuka: i });
                }
              });
            }
          });
        });
        res.json(nizIsporuka);
        db.logger.create({ Username: req.authData.user.username, Timestamp: Date.now(), Tabela: "Isporuka", Akcija: "getAll", Odgovor: res.statusCode });
      });
    });
  });
});
router.post("/add", verifyToken, async function(req,res){
  db.korisnik.findOne({where:{idUloga:2}}).then(vozac=>{
    db.vozilo.findOne({where:{idKorisnik:vozac.id}}).then(vozilo=>{
      db.isporuka.create({idVozilo: vozilo.id}).then(isporuka=>{
        db.narudzba.findAll({where:{idIsporuka:null}}).then(narudzbe=>{
          narudzbe.forEach(n=>{
            n.idIsporuka=isporuka.id;
            n.save();
          })
          res.json({"message": "Uspjesno kreirana isporuka"})
         db.logger.create({ Username: req.authData.user.username, Timestamp: Date.now(), Tabela: "Isporuka", Akcija: "postIsporuka", Odgovor: res.statusCode });
        })
      })
    })
  })
})
module.exports = router;
