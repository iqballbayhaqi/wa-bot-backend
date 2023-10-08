const { DataTypes } = require("sequelize");

module.exports = model;
function model(sequelize) {
  const attributes = {
    ticketNumber: { type: DataTypes.STRING, allowNull: false },
    startTime: { type: DataTypes.DATE, allowNull: false },
    endTime: { type: DataTypes.STRING, allowNull: false },
    issue: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
  };

  const options = {};

  return sequelize.define("Ticket", attributes, options);
}
