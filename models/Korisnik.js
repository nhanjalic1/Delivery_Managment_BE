module.exports=function(sequelize, DataTypes){
    const Korisnik=sequelize.define("Korisnik",{
        Username: {
            type: DataTypes.STRING
        },
        Password: {
            type: DataTypes.STRING
        },
        Ime:{
          type: DataTypes.STRING
        },
        Prezime: {
          type: DataTypes.STRING
        }
      });
    return Korisnik;
  }