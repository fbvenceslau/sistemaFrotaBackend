'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clients', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cod_client: {
        type: Sequelize.STRING(12),
        unique: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('fisica', 'juridica'),
        allowNull: false,
        defaultValue: 'fisica',
      },
      /* =====================
          PESSOA FÍSICA
      ===================== */
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      cpf: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      /* =====================
          PESSOA JURÍDICA
      ===================== */
      company_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      cnpj: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      /* =====================
          CONTATO
      ===================== */
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      /* =====================
          ENDEREÇO
      ===================== */
      address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(2),
        allowNull: false,
      },
      zip_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      /* =====================
          AUDITORIA
      ===================== */
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // Índices
    await queryInterface.addIndex('clients', ['cod_client']);
    await queryInterface.addIndex('clients', ['email']);
    await queryInterface.addIndex('clients', ['cpf']);
    await queryInterface.addIndex('clients', ['cnpj']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('clients');
  },
};
