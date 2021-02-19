module.exports=function(sequelize, DataTypes){
    const Narudzba=sequelize.define("Narudzba",{
        VrijemeNarudzbe:{
            type:DataTypes.DATE
        },
        RokIsporuke: {
            type: DataTypes.DATE
        },
        Status:{
            type: DataTypes.STRING
        },
        Razlog:{
            type: DataTypes.STRING
        }
    });
    return Narudzba;
}