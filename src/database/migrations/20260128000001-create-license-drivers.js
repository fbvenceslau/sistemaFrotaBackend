'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('licenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING
      },
      cpf: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING
      },
      category: {
        allowNull: false,
        type: Sequelize.DataTypes.ENUM(
          'ACC',
          'A',
          'B',
          'C',
          'D',
          'E'
        )
      },
      expiry_date: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE
      },
      primary_date: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE
      },
      mirror: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING
      },
      number_register: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING
      },
      ear: {
        allowNull: true,
        defaultValue:false,
        type: Sequelize.DataTypes.BOOLEAN
      },
      courses: {
        type: Sequelize.STRING
      },
      user_id: {
        allowNull: false,
        unique: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      license_url: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      }
    })
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.dropTable('licenses')
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS "enum_licenses_category";'
  )
}
};

/**
 * Executar a migration para criar a tabela de usuários
 * npx sequelize-cli db:migrate 
 * Nota: Após criar a tabela de usuários, execute o seeder para adicionar os usuários iniciais.
 */