import { Sequelize, Dialect } from "sequelize";

export const sequelize = new Sequelize({
  dialect: (process.env.DB_DIALECT as Dialect) || "postgres", //'process.env.DB_DIALECT' retorna string, o Sequelize espera o tipo específico Dialect

  benchmark: true,
  logQueryParameters: true,
  logging: (sql, timing) => {
    const timeInfo = typeof timing === "number" ? ` (${timing} ms)` : "";
    console.log(`${sql}${timeInfo}`);
  },

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  define: {
    underscored: true
  },
})

