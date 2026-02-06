'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const { QueryTypes } = Sequelize

    const users = await queryInterface.sequelize.query(
      "SELECT id, email, role FROM users WHERE email IN (:emails)",
      {
        replacements: {
          emails: [
            'controller@email.com',
            'driver@email.com',
            'fabio.venceslau@email.com'
          ]
        },
        type: QueryTypes.SELECT
      }
    )

    const userIdByEmail = users.reduce((acc, user) => {
      acc[user.email] = user.id
      return acc
    }, {})

    const controllerId = userIdByEmail['controller@email.com']
    const driverIds = [
      userIdByEmail['driver@email.com'],
      userIdByEmail['fabio.venceslau@email.com']
    ].filter(Boolean)

    if (!controllerId || driverIds.length === 0) {
      throw new Error("Missing controller/driver users for deliveries seeder")
    }

    const clients = await queryInterface.sequelize.query(
      "SELECT id, cod_client FROM clients WHERE cod_client IN (:codes)",
      {
        replacements: {
          codes: ['CLI000001', 'CLI000002', 'CLI000003', 'CLI000004']
        },
        type: QueryTypes.SELECT
      }
    )

    const clientIdByCode = clients.reduce((acc, client) => {
      acc[client.cod_client] = client.id
      return acc
    }, {})

    if (!clientIdByCode.CLI000001) {
      throw new Error("Missing clients for deliveries seeder")
    }

    const deliveries = [
      {
        sender_name: 'João Silva',
        sender_phone: '62999990001',
        recipient_name: 'Maria Souza',
        recipient_phone: '62988880001',
        address: 'Av. Goiás, 100',
        city: 'Goiânia',
        zip_code: '74000000',
        package_description: 'Documentos',
        origin_address: 'Setor Central, Goiânia - GO',
        destination_address: 'Jardim Guanabara, Goiânia - GO',
        origin_latitude: -16.6799,
        origin_longitude: -49.255,
        destination_latitude: -16.6395,
        destination_longitude: -49.2352,
        status: 'pending',
        created_by_controller_id: controllerId,
        assigned_driver_id: null,
        client_id: clientIdByCode.CLI000001,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        sender_name: 'Carlos Pereira',
        sender_phone: '62999990002',
        recipient_name: 'Ana Lima',
        recipient_phone: '62988880002',
        address: 'Rua 44, 200',
        city: 'Goiânia',
        zip_code: '74003000',
        package_description: 'Roupas',
        origin_address: 'Setor Central, Goiânia - GO',
        destination_address: 'Santa Genoveva, Goiânia - GO',
        origin_latitude: -16.6799,
        origin_longitude: -49.255,
        destination_latitude: -16.5964,
        destination_longitude: -49.2221,
        status: 'in_progress',
        created_by_controller_id: controllerId,
        assigned_driver_id: driverIds[0],
        client_id: clientIdByCode.CLI000002,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        sender_name: 'Empresa XP',
        sender_phone: '6233330001',
        recipient_name: 'Lucas Rocha',
        recipient_phone: '62988880003',
        address: 'Av. Anhanguera, 500',
        city: 'Goiânia',
        zip_code: '74110010',
        package_description: 'Eletrônicos',
        origin_address: 'Shopping Flamboyant, Goiânia - GO',
        destination_address: 'Setor Bueno, Goiânia - GO',
        origin_latitude: -16.7027,
        origin_longitude: -49.2304,
        destination_latitude: -16.7082,
        destination_longitude: -49.2663,
        status: 'completed',
        created_by_controller_id: controllerId,
        assigned_driver_id: driverIds[1] || driverIds[0],
        client_id: clientIdByCode.CLI000003,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        sender_name: 'Marcos Lima',
        sender_phone: '62999990004',
        recipient_name: 'Fernanda Alves',
        recipient_phone: '62988880004',
        address: 'Av. Perimetral Norte',
        city: 'Goiânia',
        zip_code: '74640000',
        package_description: 'Eletrodoméstico',
        origin_address: 'Vale dos Sonhos, Goiânia - GO',
        destination_address: 'Shopping Passeio das Águas, Goiânia - GO',
        origin_latitude: -16.596,
        origin_longitude: -49.298,
        destination_latitude: -16.6289,
        destination_longitude: -49.3164,
        status: 'cancelled',
        created_by_controller_id: controllerId,
        assigned_driver_id: null,
        client_id: clientIdByCode.CLI000004,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        sender_name: 'Maria Oliveira',
        sender_phone: '62999990004',
        recipient_name: 'Fernanda Alves',
        recipient_phone: '62988880004',
        address: 'Av. Perimetral Norte',
        city: 'Goiânia',
        zip_code: '74640000',
        package_description: 'Eletrodoméstico',
        origin_address: 'Vale dos Sonhos, Goiânia - GO',
        destination_address: 'Shopping Passeio das Águas, Goiânia - GO',
        origin_latitude: -16.596,
        origin_longitude: -49.298,
        destination_latitude: -16.6289,
        destination_longitude: -49.3164,
        status: 'cancelled',
        created_by_controller_id: controllerId,
        assigned_driver_id: null,
        client_id: clientIdByCode.CLI000001,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        sender_name: 'Marta Martins',
        sender_phone: '62999990004',
        recipient_name: 'Fernanda Alves',
        recipient_phone: '62988880004',
        address: 'Av. Perimetral Norte',
        city: 'Goiânia',
        zip_code: '74640000',
        package_description: 'Eletrônicos',
        origin_address: 'Vale dos Sonhos, Goiânia - GO',
        destination_address: 'Shopping Passeio das Águas, Goiânia - GO',
        origin_latitude: -16.596,
        origin_longitude: -49.298,
        destination_latitude: -16.6289,
        destination_longitude: -49.3164,
        status: 'cancelled',
        created_by_controller_id: controllerId,
        assigned_driver_id: null,
        client_id: clientIdByCode.CLI000002,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Clona os registros até chegar em ~30
    const bulk = [];
    for (let i = 0; i < 99; i++) {
      const base = deliveries[i % deliveries.length];
      bulk.push({
        ...base,
        sender_name: `${base.sender_name} ${i + 1}`,
        recipient_name: `${base.recipient_name} ${i + 1}`,
        sender_phone: `6299999${String(i).padStart(4, '0')}`,
        recipient_phone: `6298888${String(i).padStart(4, '0')}`,
        status: ['pending', 'in_progress', 'completed', 'cancelled'][i % 4],
        assigned_driver_id: i % 4 === 1 || i % 4 === 2 ? driverIds[i % driverIds.length] : null,
        client_id: [
          clientIdByCode.CLI000001,
          clientIdByCode.CLI000002,
          clientIdByCode.CLI000003,
          clientIdByCode.CLI000004
        ][i % 4],
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('deliveries', bulk);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('deliveries', null, {});
  }
};


/**
 * Executar o seeder apos criar a tabela deliveries 
 * npx sequelize-cli db:seed --seed src/database/seeders/20260203233626-deliveries.js
 * Para desfazer o seeder
 * npx sequelize-cli db:seed:undo --seed src/database/seeders/20260203233626-deliveries.js
 */