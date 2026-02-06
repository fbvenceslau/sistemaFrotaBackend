const bcrypt = require('bcrypt')

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'AdminX@1024'
    const controllerPassword = process.env.SEED_CONTROLLER_PASSWORD || 'Controller@2048'
    const driverPassword = process.env.SEED_DRIVER_PASSWORD || 'Driver@4096'
    const userPassword = process.env.SEED_USER_PASSWORD || 'User@4096'

    const hashedPasswordAdmin = await bcrypt.hash(adminPassword, 10)
    const hashedPasswordController = await bcrypt.hash(controllerPassword, 10)
    const hashedPasswordDriver = await bcrypt.hash(driverPassword, 10)
    const hashedPasswordUser = await bcrypt.hash(userPassword, 10)

    await queryInterface.bulkInsert('users', [
      {
        first_name: 'Administrador',
        last_name: 'do Sistema',
        phone: '0000-0000',
        birth: '1990-01-01',
        email: 'admin@email.com',
        password: hashedPasswordAdmin,
        role: 'admin',
        active: true,
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
        active: true,
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
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },      {
        first_name: 'Fábio',
        last_name: 'Venceslu de Souza',
        phone: '2222-2222',
        birth: '1998-08-20',
        email: 'fabio.venceslau@email.com',
        password: hashedPasswordUser,
        role: 'driver',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },      
      {
        first_name: 'Ayla',
        last_name: 'Nunes Venceslau',
        phone: '2222-2222',
        birth: '1998-08-20',
        email: 'ayla.venceslau@email.com',
        password: hashedPasswordUser,
        role: 'controller',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Daniel',
        last_name: 'Moura',
        phone: '2222-2222',
        birth: '1998-08-20',
        email: 'daniel.moura@email.com',
        password: hashedPasswordUser,
        role: 'admin',
        active: true,
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
