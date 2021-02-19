module.exports=function(sequelize, DataTypes){
    const Roba=sequelize.define("Roba",{
        Naziv: {
        type: DataTypes.STRING
        },
        Zapremina: {
          type: DataTypes.FLOAT
        },
        Tezina: {
            type: DataTypes.FLOAT
        }
      });
    return Roba;
  }