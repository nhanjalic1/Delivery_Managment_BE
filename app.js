var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var narudzbaRouter = require("./routes/narudzba");
var kupacRouter = require("./routes/kupac");
var robaRouter = require("./routes/roba");
var isporukaRouter = require("./routes/isporuka");
const db = require("./utils/database");
const { Router } = require("express");
var Kodiranje = require("./utils/kodiranje");

var app = express();

let corsOptions = {
  origin: "https://localhost:3000", // Compliant
};

app.use(cors(corsOptions));
app.use('/', express.static('./public2'));
db.sequelize
  .sync({
   /* force:true*/
  })
  .then(function () {
   /* db.insertUloge().then(()=>{
    db.insertKorisnici().then(()=>{
      db.insertArtikli().then(()=>{
        db.insertGradovi().then(()=>{
          db.insertMape().then(()=>{
            db.insertKupca().then(()=>{
              db.insertVozila().then(()=>{
                db.insertIsporuke().then(()=>{
                  db.insertNarudzbe().then(()=>{
                    db.insertNarudzbaIteams()
                  })
                })
              })
            })
          })
        })
      })
    })
  });*/
    console.log("tabele kreirane!");
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/narudzba", narudzbaRouter);
app.use("/kupac", kupacRouter);
app.use("/roba", robaRouter);
app.use("/isporuka", isporukaRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
