// membership

'use strict';
/** @type {import('sequelize-cli').Migration} */


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("Memberships", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {model: "Users"},
        onDelete: "CASCADE"
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {model: "Groups"},
        onDelete: "CASCADE"
      },
      status: {
        type: Sequelize.ENUM("co-host", "member", "pending"),
        allowNull:false,
        defaultValue: 'pending' // NOT SURE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = "Memberships";
    return queryInterface.dropTable(options);
  }
};
