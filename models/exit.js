'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Exit.init({
    exitId: DataTypes.STRING,
    name: DataTypes.STRING,
    x: DataTypes.DECIMAL,
    y: DataTypes.DECIMAL,
    adjacentLocationIds: DataTypes.STRING,
    isDisabled: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Exit',
  });
  return Exit;
};