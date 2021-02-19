module.exports=function(sequelize, DataTypes){
    const Kupac=sequelize.define("Kupac",{
        Naziv: {
            type: DataTypes.STRING
        },
        Adresa: {
            type: DataTypes.STRING
        },
        lokacijLat: {
          type: DataTypes.FLOAT
        },
        lokacijLng: {
          type: DataTypes.FLOAT
        }
      });
    return Kupac;
  }