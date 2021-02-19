module.exports = function (sequelize, DataTypes) {
  const RefreshToken = sequelize.define("RefreshToken", {
    userId: {
      type: DataTypes.INTEGER,
    },
    refreshToken: {
      //type: DataTypes.STRING(65535),
      type:DataTypes.STRING(2048)
    },
  });
  return RefreshToken;
};
