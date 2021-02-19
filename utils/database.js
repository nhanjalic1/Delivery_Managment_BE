const { Sequelize } = require("sequelize");
const Uloga = require("../models/Uloga.js");
var Kodiranje = require("../utils/kodiranje");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.DBUSERNAME, process.env.DBPASSWORD, {
  host: "localhost",
  dialect: "mysql",
  logging: false,
}); 
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.grad = require("../models/Grad.js")(sequelize, Sequelize);
db.isporuka = require("../models/Isporuka.js")(sequelize, Sequelize);
db.korisnik = require("../models/Korisnik.js")(sequelize, Sequelize);
db.mapa = require("../models/Mapa.js")(sequelize, Sequelize);
db.narudzba = require("../models/Narudzba.js")(sequelize, Sequelize);
db.narudzbaItem = require("../models/NarudzbaItem.js")(sequelize, Sequelize);
db.roba = require("../models/Roba.js")(sequelize, Sequelize);
db.uloga = require("../models/Uloga.js")(sequelize, Sequelize);
db.vozilo = require("../models/Vozilo.js")(sequelize, Sequelize);
db.kupac = require("../models/Kupac.js")(sequelize, Sequelize);
db.refreshtoken = require("../models/RefreshToken.js")(sequelize, Sequelize); 
db.logger = require("../models/Logger.js")(sequelize, Sequelize);

db.korisnik.belongsTo(db.uloga, { foreignKey: "idUloga" });
db.vozilo.belongsTo(db.korisnik, { foreignKey: "idKorisnik" });
db.isporuka.belongsTo(db.vozilo, { foreignKey: "idVozilo" });
db.narudzbaItem.belongsTo(db.roba, { foreignKey: "idRoba" });
db.narudzbaItem.belongsTo(db.narudzba, { foreignKey: "idNarudzba" });
db.narudzba.belongsTo(db.kupac, { foreignKey: "idKupac" });
db.narudzba.belongsTo(db.isporuka, { foreignKey: "idIsporuka" });
db.mapa.belongsTo(db.grad, { foreignKey: "idGrad1" });
db.mapa.belongsTo(db.grad, { foreignKey: "idGrad2" });
db.kupac.belongsTo(db.grad, { foreignKey: "idGrad" });

db.insertUloge = async function () {
  const admin = await db.uloga.create({ Naziv: "Administrator" }, (fields = ["Naziv"]));
  const vozac = await db.uloga.create({ Naziv: "Vozac" }, (fields = ["Naziv"]));
  const uprava = await db.uloga.create({ Naziv: "Uprava" }, (fields = ["Naziv"]));
};
db.insertKorisnici = async function () {
  let kodiranje = new Kodiranje()
  var uloge = await db.uloga.findAll();
  const useradmin = await db.korisnik.create(
    { Username: "admin", Password: await kodiranje.kodirajPassword("Password1234"), Ime: "Envera", Prezime: "Husagic", idUloga: uloge[0].id },
    (fields = ["Username", "Password", "Ime", "Prezime", "idUloga"])
  );
  const uservozac = await db.korisnik.create(
    { Username: "vozac1", Password: await kodiranje.kodirajPassword("Password1234"), Ime: "Naida", Prezime: "Hanjalic", idUloga: uloge[1].id },
    (fields = ["Username", "Password", "Ime", "Prezime", "idUloga"])
  );
  const useruprava = await db.korisnik.create(
    { Username: "uprava", Password: await kodiranje.kodirajPassword("Password1234"), Ime: "Mirza ", Prezime: "Delibasic", idUloga: uloge[2].id },
    (fields = ["Username", "Password", "Ime", "Prezime", "idUloga"])
  );
  const uservozac2 = await db.korisnik.create(
    { Username: "vozac2", Password: await kodiranje.kodirajPassword("Password1234"), Ime: "Amra", Prezime: "Habibovic", idUloga: uloge[1].id },
    (fields = ["Username", "Password", "Ime", "Prezime", "idUloga"])
  );
};
db.insertArtikli = async function () {
  const a1 = await db.roba.create({ Naziv: "stolica", Zapremina: 3, Tezina: 10 }, (fields = ["Naziv", "Zapremina", "Tezina"]));
  const a2 = await db.roba.create({ Naziv: "sto", Zapremina: 3, Tezina: 23 }, (fields = ["Naziv", "Zapremina", "Tezina"]));
  const a3 = await db.roba.create({ Naziv: "komoda", Zapremina: 5, Tezina: 10 }, (fields = ["Naziv", "Zapremina", "Tezina"]));
  const a4 = await db.roba.create({ Naziv: "kuhinja", Zapremina: 3, Tezina: 12 }, (fields = ["Naziv", "Zapremina", "Tezina"]));
  const a5 = await db.roba.create({ Naziv: "ogledalo", Zapremina: 7, Tezina: 7 }, (fields = ["Naziv", "Zapremina", "Tezina"]));
  const a6 = await db.roba.create({ Naziv: "krevet", Zapremina: 3, Tezina: 15 }, (fields = ["Naziv", "Zapremina", "Tezina"]));
  const a7 = await db.roba.create({ Naziv: "ormar", Zapremina: 9, Tezina: 10 }, (fields = ["Naziv", "Zapremina", "Tezina"]));
  const a8 = await db.roba.create({ Naziv: "fotelja", Zapremina: 3, Tezina: 14 }, (fields = ["Naziv", "Zapremina", "Tezina"]));
  const a9 = await db.roba.create({ Naziv: "ugaona garnitura", Zapremina: 3, Tezina: 10 }, (fields = ["Naziv", "Zapremina", "Tezina"]));
  const a10 = await db.roba.create({ Naziv: "tepih", Zapremina: 3, Tezina: 10 }, (fields = ["Naziv", "Zapremina", "Tezina"]));
};
db.insertGradovi = async function () {
  const grad1 = await db.grad.create({ Naziv: "Kakanj" }, (fields = ["Naziv"]));
  const grad2 = await db.grad.create({ Naziv: "Sarajevo" }, (fields = ["Naziv"]));
  const grad3 = await db.grad.create({ Naziv: "Zenica" }, (fields = ["Naziv"]));
  const grad4 = await db.grad.create({ Naziv: "Mostar" }, (fields = ["Naziv"]));
  const grad5 = await db.grad.create({ Naziv: "Banja Luka" }, (fields = ["Naziv"]));
};
db.insertMape = async function () {
  gradovi = await db.grad.findAll();
  const mapa11 = await db.mapa.create({ Udaljenost: 0, idGrad1: gradovi[0].id, idGrad2: gradovi[0].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa12 = await db.mapa.create({ Udaljenost: 55.5, idGrad1: gradovi[0].id, idGrad2: gradovi[1].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa13 = await db.mapa.create({ Udaljenost: 30, idGrad1: gradovi[0].id, idGrad2: gradovi[2].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa14 = await db.mapa.create({ Udaljenost: 140, idGrad1: gradovi[0].id, idGrad2: gradovi[3].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa15 = await db.mapa.create({ Udaljenost: 150, idGrad1: gradovi[0].id, idGrad2: gradovi[4].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa21 = await db.mapa.create({ Udaljenost: 55.5, idGrad1: gradovi[1].id, idGrad2: gradovi[0].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa22 = await db.mapa.create({ Udaljenost: 0, idGrad1: gradovi[1].id, idGrad2: gradovi[1].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa23 = await db.mapa.create({ Udaljenost: 85.5, idGrad1: gradovi[1].id, idGrad2: gradovi[2].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa24 = await db.mapa.create({ Udaljenost: 84.5, idGrad1: gradovi[1].id, idGrad2: gradovi[3].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa25 = await db.mapa.create({ Udaljenost: 195.5, idGrad1: gradovi[1].id, idGrad2: gradovi[4].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa31 = await db.mapa.create({ Udaljenost: 30, idGrad1: gradovi[2].id, idGrad2: gradovi[0].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa32 = await db.mapa.create({ Udaljenost: 85.5, idGrad1: gradovi[2].id, idGrad2: gradovi[1].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa33 = await db.mapa.create({ Udaljenost: 0, idGrad1: gradovi[2].id, idGrad2: gradovi[2].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa34 = await db.mapa.create({ Udaljenost: 170, idGrad1: gradovi[2].id, idGrad2: gradovi[3].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa35 = await db.mapa.create({ Udaljenost: 120, idGrad1: gradovi[2].id, idGrad2: gradovi[4].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa41 = await db.mapa.create({ Udaljenost: 140, idGrad1: gradovi[3].id, idGrad2: gradovi[0].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa42 = await db.mapa.create({ Udaljenost: 84.5, idGrad1: gradovi[3].id, idGrad2: gradovi[1].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa43 = await db.mapa.create({ Udaljenost: 170, idGrad1: gradovi[3].id, idGrad2: gradovi[2].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa44 = await db.mapa.create({ Udaljenost: 0, idGrad1: gradovi[3].id, idGrad2: gradovi[3].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa45 = await db.mapa.create({ Udaljenost: 290, idGrad1: gradovi[3].id, idGrad2: gradovi[4].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa51 = await db.mapa.create({ Udaljenost: 150, idGrad1: gradovi[4].id, idGrad2: gradovi[0].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa52 = await db.mapa.create({ Udaljenost: 195.5, idGrad1: gradovi[4].id, idGrad2: gradovi[1].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa53 = await db.mapa.create({ Udaljenost: 120, idGrad1: gradovi[4].id, idGrad2: gradovi[2].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa54 = await db.mapa.create({ Udaljenost: 290, idGrad1: gradovi[4].id, idGrad2: gradovi[3].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
  const mapa55 = await db.mapa.create({ Udaljenost: 0, idGrad1: gradovi[4].id, idGrad2: gradovi[4].id }, (fields = ["Udaljenost", "idGrad1", "idGrad2"]));
};
db.insertKupca = async function () {
  gradovi = await db.grad.findAll();
  const k1 = await db.kupac.create(
    { Naziv: "Alpha doo", Adresa: "Titova 19", idGrad: gradovi[1].id, lokacijLat: 43.858837, lokacijLng: 18.419333 },
    (fields = ["Naziv", "Adresa", "idGrad", "lokacijaLat", "lokacijaLng"])
  );
  const k2 = await db.kupac.create(
    { Naziv: "Beta doo", Adresa: "Londža bb", idGrad: gradovi[2].id, lokacijLat: 44.196973, lokacijLng: 17.915219 },
    (fields = ["Naziv", "Adresa", "idGrad", "lokacijaLat", "lokacijaLng"])
  );
  const k3 = await db.kupac.create(
    { Naziv: "Gamma doo", Adresa: "Dubrovačka 76", idGrad: gradovi[3].id, lokacijLat: 43.349838, lokacijLng: 17.797895 },
    (fields = ["Naziv", "Adresa", "idGrad", "lokacijaLat", "lokacijaLng"])
  );
  const k4 = await db.kupac.create(
    { Naziv: "Delta doo", Adresa: "Meše Selimovića bb", idGrad: gradovi[4].id, lokacijLat: 44.767477, lokacijLng: 17.185614 },
    (fields = ["Naziv", "Adresa", "idGrad", "lokacijaLat", "lokacijaLng"])
  );
};
db.insertVozila = async function () {
  korisnici = await db.korisnik.findAll();
  const v1 = await db.vozilo.create({ idKorisnik: korisnici[1].id }, (fields = ["idKorisnik"]));
  const v2 = await db.vozilo.create({ idKorisnik: korisnici[3].id }, (fields = ["idKorisnik"]));
};
db.insertIsporuke = async function () {
  vozila = await db.vozilo.findAll();
  const i1 = await db.isporuka.create({ idVozilo: vozila[0].id }, (fields = ["idVozilo"]));
  const i2 = await db.isporuka.create({ idVozilo: vozila[1].id }, (fields = ["idVozilo"]));
};
db.insertNarudzbe = async function () {
  isporuke = await db.isporuka.findAll();
  kupci = await db.kupac.findAll();
  const n1 = await db.narudzba.create(
    { RokIsporuke: new Date("2020-12-21"), VrijemeNarudzbe: new Date("2020-12-20"), idIsporuka: isporuke[1].id, idKupac: kupci[1].id, Status: "Isporuceno",Razlog:null},
    (fields = ["RokIsporuke", "VrijemeNarudzbe", "idIsporuka", "idKupac", "status","razlog"])
  );
  const n2 = await db.narudzba.create(
    { RokIsporuke: new Date("2020-12-21"), VrijemeNarudzbe: new Date("2020-12-20"), idIsporuka: isporuke[1].id, idKupac: kupci[0].id, Status: "Isporuceno",Razlog:null},
    (fields = ["RokIsporuke", "VrijemeNarudzbe", "idIsporuka", "idKupac", "status","razlog"])
  );
  const n3 = await db.narudzba.create(
    { RokIsporuke: new Date("2021-01-04"), VrijemeNarudzbe: new Date("2021-01-03"), idIsporuka: isporuke[0].id, idKupac: kupci[3].id, Status: "Isporuceno",Razlog:null},
    (fields = ["RokIsporuke", "VrijemeNarudzbe", "idIsporuka", "idKupac", "status","razlog"])
  );
};
db.insertRobas = async function () {};
db.insertNarudzbaIteams = async function () {
  narudzba = await db.narudzba.findAll();
  roba = await db.roba.findAll();
  const ni1 = await db.narudzbaItem.create({ Kolicina: 2, idRoba: roba[3].id, idNarudzba: narudzba[0].id }, (fields = ["Kolicina", "idRoba", "idNarudzba"]));
  const ni2 = await db.narudzbaItem.create({ Kolicina: 2, idRoba: roba[1].id, idNarudzba: narudzba[0].id }, (fields = ["Kolicina", "idRoba", "idNarudzba"]));
  const ni3 = await db.narudzbaItem.create({ Kolicina: 3, idRoba: roba[2].id, idNarudzba: narudzba[1].id }, (fields = ["Kolicina", "idRoba", "idNarudzba"]));
  const ni4 = await db.narudzbaItem.create({ Kolicina: 1, idRoba: roba[2].id, idNarudzba: narudzba[2].id }, (fields = ["Kolicina", "idRoba", "idNarudzba"]));
};
//mapa11.belongsTo()

//User.belongsTo(Company, {foreignKey: 'fk_company'});

module.exports = db;
/*    
try{
    await this.connection.authenticate();
    console.log('Uspjesna konekcija.');
} 
catch (error) {
    console.error('Neuspješna konekcija:', error);
}
*/
