'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {

      await queryInterface.addColumn(
        'deliveries',
        'origin_latitude',
        {
          type: Sequelize.DECIMAL(10, 8),
          allowNull: false
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'deliveries',
        'origin_longitude',
        {
          type: Sequelize.DECIMAL(11, 8),
          allowNull: false
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'deliveries',
        'destination_latitude',
        {
          type: Sequelize.DECIMAL(10, 8),
          allowNull: false
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'deliveries',
        'destination_longitude',
        {
          type: Sequelize.DECIMAL(11, 8),
          allowNull: false
        },
        { transaction }
      );

    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('deliveries', 'origin_latitude', { transaction });
      await queryInterface.removeColumn('deliveries', 'origin_longitude', { transaction });
      await queryInterface.removeColumn('deliveries', 'destination_latitude', { transaction });
      await queryInterface.removeColumn('deliveries', 'destination_longitude', { transaction });
    });
  }
};
