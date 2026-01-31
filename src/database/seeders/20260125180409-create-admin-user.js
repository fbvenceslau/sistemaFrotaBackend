const bcrypt = require('bcrypt')

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPasswordAdmin = await bcrypt.hash('AdminX@1024', 10)
    const hashedPasswordController = await bcrypt.hash('Controller@2048', 10)
    const hashedPasswordDriver = await bcrypt.hash('Driver@4096', 10)

    await queryInterface.bulkInsert('users', [
      {
        first_name: 'Administrador',
        last_name: 'do Sistema',
        phone: '0000-0000',
        birth: '1990-01-01',
        email: 'admin@email.com',
        password: hashedPasswordAdmin,
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Controlador',
        last_name: 'do Sistema',
        phone: '1111-1111',
        birth: '1995-05-15',
        email: 'controller@email.com',
        password: hashedPasswordController,
        role: 'controller',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Mostorista',
        last_name: 'do Sistema',
        phone: '2222-2222',
        birth: '1998-08-20',
        email: 'driver@email.com',
        password: hashedPasswordDriver,
        role: 'driver',
        created_at: new Date(),
        updated_at: new Date()
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {})
  }
};

/**
 * Executar o seeder apos criar a tabela de usuário 
 * npx sequelize-cli db:seed --seed src/database/seeders/20260125180409-create-admin-user.js
 */
