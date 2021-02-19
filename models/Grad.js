module.exports=function(sequelize, DataTypes){
    const Grad=sequelize.define("Grad",{
        Naziv: {
        type: DataTypes.STRING
        }
    });
    return Grad;
}