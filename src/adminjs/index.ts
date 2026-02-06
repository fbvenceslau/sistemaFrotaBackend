import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from "@adminjs/sequelize";
import { sequelize } from "../database";
import { adminJsResources } from "./resources";
import { locale } from "./locale";
import { brandingOptions } from "./branding";
import { authenticationOptions } from "./authentication";

AdminJS.registerAdapter(AdminJSSequelize);

export const adminJs = new AdminJS({
  databases: [sequelize],
  rootPath: "/admin",
  resources: adminJsResources,
  branding: brandingOptions,
  locale: locale,
  assets: {
    scripts: [
      '/admin-custom.js', // Script customizado para traduzir alertas
    ],
  },
});

export const adminJsRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  authenticationOptions,
  null,
  {
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
    name: 'adminjs',
  }
);

// Error handler para AdminJS - tratamento de sessão e erros de conexão
adminJsRouter.use((err: any, req: any, res: any, next: any) => {
  console.error('[AdminJS Error]', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // Se for erro de sessão ou banco de dados, redireciona com mensagem amigável
  if (err.name === 'SequelizeConnectionError' || err.message?.includes('session')) {
    return res.status(503).json({
      error: {
        message: 'Serviço temporariamente indisponível. Por favor, tente novamente em alguns instantes.',
      }
    });
  }

  next(err);
});