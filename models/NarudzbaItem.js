module.exports=function(sequelize, DataTypes){
    const NarudzbaItem=sequelize.define("NarudzbaItem",{
        Kolicina: {
        type: DataTypes.INTEGER
        },
       
    });
    return NarudzbaItem;
}