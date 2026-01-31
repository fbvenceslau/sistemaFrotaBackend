'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Deliveries', 'originLatitude', {
      allowNull: false,
      type: Sequelize.FLOAT,
      defaultValue: 0
    });

    await queryInterface.addColumn('Deliveries', 'originLongitude', {
      allowNull: false,
      type: Sequelize.FLOAT,
      defaultValue: 0
    });

    await queryInterface.addColumn('Deliveries', 'destinationLatitude', {
      allowNull: false,
      type: Sequelize.FLOAT,
      defaultValue: 0
    });

    await queryInterface.addColumn('Deliveries', 'destinationLongitude', {
      allowNull: false,
      type: Sequelize.FLOAT,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Deliveries', 'originLatitude');
    await queryInterface.removeColumn('Deliveries', 'originLongitude');
    await queryInterface.removeColumn('Deliveries', 'destinationLatitude');
    await queryInterface.removeColumn('Deliveries', 'destinationLongitude');
  }
};
