module.exports=function(sequelize, DataTypes){
  const Uloga=sequelize.define("Uloga",{
      Naziv: {
      type: DataTypes.STRING
      }
    });
  return Uloga;
}