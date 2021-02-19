module.exports=function(sequelize, DataTypes){
    const Logger=sequelize.define("Logger",{
        Username: {
            type: DataTypes.STRING
        },
        Timestamp: {
            type: DataTypes.DATE
        },
        Tabela: {
          type: DataTypes.STRING
        },
        Akcija: {
          type: DataTypes.STRING
        },
        Odgovor: {
            type: DataTypes.INTEGER
        }
      });
    return Logger;
  }