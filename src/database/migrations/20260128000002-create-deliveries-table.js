'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('deliveries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      /* =====================
         REMETENTE
      ===================== */
      sender_name: {
        allowNull: false,
        type: Sequelize.STRING
      },

      sender_phone: {
        allowNull: false,
        type: Sequelize.STRING
      },

      /* =====================
         DESTINATÁRIO
      ===================== */
      recipient_name: {
        allowNull: false,
        type: Sequelize.STRING
      },

      recipient_phone: {
        allowNull: false,
        type: Sequelize.STRING
      },

      /* =====================
         ENDEREÇO PADRÃO
      ===================== */
      address: {
        allowNull: false,
        type: Sequelize.STRING
      },

      city: {
        allowNull: false,
        type: Sequelize.STRING
      },

      zip_code: {
        allowNull: false,
        type: Sequelize.STRING
      },

      /* =====================
         ENTREGA
      ===================== */
      package_description: {
        allowNull: false,
        type: Sequelize.STRING
      },

      origin_address: {
        allowNull: false,
        type: Sequelize.STRING
      },

      destination_address: {
        allowNull: false,
        type: Sequelize.STRING
      },

      status: {
        allowNull: false,
        type: Sequelize.ENUM(
          'pending',
          'in_progress',
          'completed',
          'cancelled'
        ),
        defaultValue: 'pending'
      },
      assigned_driver_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      created_by_controller_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('deliveries');
  }
};
