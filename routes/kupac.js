var express = require('express');
const db = require('../utils/database');
const verifyToken = require('../utils/verify');
var router = express.Router();

router.get('/all',verifyToken,  async(req, res)=>{
    await db.kupac.findAll().then(kupci=>res.json(kupci));
    await db.logger.create({Username:req.authData.user.username, Timestamp:Date.now(), Tabela:"Kupac", Akcija:"getAll", Odgovor: res.statusCode});

})
module.exports = router;