module.exports=function(sequelize, DataTypes){
    const Mapa=sequelize.define("Mapa",{
        Udaljenost: {
        type: DataTypes.FLOAT
        }
    });
    return Mapa;
}