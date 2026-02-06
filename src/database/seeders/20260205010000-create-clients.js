'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const clients = [
      {
        cod_client: 'CLI000001',
        type: 'fisica',
        name: 'Ana Souza',
        cpf: '12345678901',
        company_name: null,
        cnpj: null,
        email: 'ana.souza@example.com',
        phone: '62999990001',
        address: 'Rua 1, 100',
        city: 'Goiania',
        state: 'GO',
        zip_code: '74000000',
        active: true,
        created_at: now,
        updated_at: now,
      },
      {
        cod_client: 'CLI000002',
        type: 'fisica',
        name: 'Bruno Lima',
        cpf: '12345678902',
        company_name: null,
        cnpj: null,
        email: 'bruno.lima@example.com',
        phone: '62999990002',
        address: 'Av. Central, 200',
        city: 'Goiania',
        state: 'GO',
        zip_code: '74001000',
        active: true,
        created_at: now,
        updated_at: now,
      },
      {
        cod_client: 'CLI000003',
        type: 'fisica',
        name: 'Carla Mendes',
        cpf: '12345678903',
        company_name: null,
        cnpj: null,
        email: 'carla.mendes@example.com',
        phone: '62999990003',
        address: 'Rua 3, 300',
        city: 'Goiania',
        state: 'GO',
        zip_code: '74002000',
        active: true,
        created_at: now,
        updated_at: now,
      },
      {
        cod_client: 'CLI000004',
        type: 'juridica',
        name: 'Comercial XP',
        cpf: null,
        company_name: 'XP Comercio LTDA',
        cnpj: '12345678000190',
        email: 'contato@xpcomercio.com',
        phone: '6233330001',
        address: 'Av. Goias, 500',
        city: 'Goiania',
        state: 'GO',
        zip_code: '74003000',
        active: true,
        created_at: now,
        updated_at: now,
      },
      {
        cod_client: 'CLI000005',
        type: 'juridica',
        name: 'Logistica Norte',
        cpf: null,
        company_name: 'Logistica Norte SA',
        cnpj: '12345678000191',
        email: 'contato@logisticanorte.com',
        phone: '6233330002',
        address: 'Rua 44, 900',
        city: 'Goiania',
        state: 'GO',
        zip_code: '74004000',
        active: true,
        created_at: now,
        updated_at: now,
      },
      {
        cod_client: 'CLI000006',
        type: 'juridica',
        name: 'Industria Alto',
        cpf: null,
        company_name: 'Industria Alto LTDA',
        cnpj: '12345678000192',
        email: 'contato@industriaalto.com',
        phone: '6233330003',
        address: 'Av. Anhanguera, 1200',
        city: 'Goiania',
        state: 'GO',
        zip_code: '74005000',
        active: true,
        created_at: now,
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert('clients', clients);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('clients', {
      cod_client: [
        'CLI000001',
        'CLI000002',
        'CLI000003',
        'CLI000004',
        'CLI000005',
        'CLI000006',
      ],
    });
  },
};

/**
 * Executar o seeder:
 * npx sequelize-cli db:seed --seed src/database/seeders/20260205010000-create-clients.js
 * Para desfazer o seeder:
 * npx sequelize-cli db:seed:undo --seed src/database/seeders/20260205010000-create-clients.js
 */
