const bcrypt = require('bcrypt');
const saltRounds = 10;

class Kodiranje{
    kodirajPassword(plain){
        return bcrypt.hash(plain, saltRounds);
    }
    porediPassword(plain,hash){
        return bcrypt.compare(plain, hash);
    }
}
module.exports=Kodiranje;