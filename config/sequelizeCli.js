module.exports = {
  development: {
    dialect: "postgres",
    host: "localhost",
    port: "5432",
    database: "dpg-d5umci4hg0os73b16ljg-a",
    username: "sistema_frota_user",
    password: "onps1kbnVAk10oShhSwm5vCXhpk61NnI"
    //password: "sistema_frota_pass"
  }
}

/// IGNORE THIS FILE - INSTRUCTIONS FOR POSTGRES SETUP ///
// Caso ainda não possua um usuário no PostgreSQL, crie um com a permissão CREATEDB:
// sudo -u postgres psql
// CREATE USER sistema_frota_user WITH CREATEDB ENCRYPTED PASSWORD 'sistema_frota_pass';
// Agora já será possível utilizar a sequelize-cli para criar o banco de dados:
// npx sequelize-cli db:create