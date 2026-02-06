'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const { QueryTypes } = Sequelize

    const users = await queryInterface.sequelize.query(
      "SELECT id, email FROM users WHERE email IN (:emails)",
      {
        replacements: {
          emails: [
            'driver@email.com',
            'fabio.venceslau@email.com',
            'admin@email.com',
            'controller@email.com',
            'ayla.venceslau@email.com',
            'daniel.moura@email.com'
          ]
        },
        type: QueryTypes.SELECT
      }
    )

    const userIdByEmail = users.reduce((acc, user) => {
      acc[user.email] = user.id
      return acc
    }, {})

    const requiredEmails = [
      'driver@email.com',
      'fabio.venceslau@email.com',
      'admin@email.com',
      'controller@email.com',
      'ayla.venceslau@email.com',
      'daniel.moura@email.com'
    ]

    for (const email of requiredEmails) {
      if (!userIdByEmail[email]) {
        throw new Error(`User not found for license seeder: ${email}`)
      }
    }

    await queryInterface.bulkInsert('licenses', [
      {
        user_id: userIdByEmail['driver@email.com'],
        name: 'MOSTORISTA DO SISTEMA',
        cpf: '12345678909',
        category: 'C',
        expiry_date: new Date('2027-12-31'),
        primary_date: new Date('2018-03-15'),
        mirror: 'ESP001',
        number_register: '12345678901',
        ear: false,
        courses: 'Direção Defensiva, Transporte de Cargas',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: userIdByEmail['fabio.venceslau@email.com'],
        name: 'FABIO VENCESLU DE SOUZA',
        cpf: '98765432100',
        category: 'D',
        expiry_date: new Date('2028-06-30'),
        primary_date: new Date('2015-08-20'),
        mirror: 'ESP002',
        number_register: '98765432100',
        ear: false,
        courses: 'Transporte de Passageiros, Primeiros Socorros',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: userIdByEmail['admin@email.com'],
        name: 'ADMINISTRADOR DO SISTEMA',
        cpf: '11122233344',
        category: 'B',
        expiry_date: new Date('2026-09-15'),
        primary_date: new Date('2010-05-10'),
        mirror: 'ESP003',
        number_register: '11122233344',
        ear: false,
        courses: 'Direção Defensiva',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: userIdByEmail['controller@email.com'],
        name: 'CONTROLADOR DO SISTEMA',
        cpf: '55566677788',
        category: 'B',
        expiry_date: new Date('2027-03-20'),
        primary_date: new Date('2016-11-25'),
        mirror: 'ESP004',
        number_register: '55566677788',
        ear: true,
        courses: 'Direção Defensiva',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: userIdByEmail['ayla.venceslau@email.com'],
        name: 'AYLA NUNES VENCESLAU',
        cpf: '22233344455',
        category: 'B',
        expiry_date: new Date('2029-01-10'),
        primary_date: new Date('2020-02-14'),
        mirror: 'ESP005',
        number_register: '22233344455',
        ear: false,
        courses: 'Direção Defensiva',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: userIdByEmail['daniel.moura@email.com'],
        name: 'DANIEL MOURA',
        cpf: '44455566677',
        category: 'E',
        expiry_date: new Date('2026-11-30'),
        primary_date: new Date('2012-07-08'),
        mirror: 'ESP006',
        number_register: '44455566677',
        ear: false,
        courses: 'Transporte de Cargas Perigosas, Direção Defensiva, Movimentação de Produtos Perigosos',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('licenses', null, {})
  }
};

/**
 * Executar o seeder após criar a tabela de licenses e popular usuários
 * npx sequelize-cli db:seed --seed src/database/seeders/20260204000000-create-licenses.js
 * 
 * Ou executar todos os seeders:
 * npx sequelize-cli db:seed:all
 */
