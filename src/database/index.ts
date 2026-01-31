import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  port: 5432,
  database: "sistema_frota_dev",
  username: "sistema_frota_user",
  password: "sistema_frota_pass",
  define: {
    underscored: true
  }
})