import express from "express";
import { authController } from "./controllers/authController";
import { usersController } from "./controllers/usersController";
import { deliveryController } from "./controllers/deliveryController";
import { ensureAuth } from "./middlewares/auth";
import { driversController } from "./controllers/driversController";
import { clientController } from "./controllers/clientController";
import { licenseController } from "./controllers/licenseController";

const router = express.Router();

// ===== Auth =====
// Registro de usuario
router.post("/auth/register", authController.register);
// Login de driver
router.post("/auth/login-driver", authController.login);
// Login de controller
router.post("/auth/login-controller", authController.loginController);

// ===== Usuarios =====
// Usuario logado (alias de /users/profile)
router.get("/users/current", ensureAuth, usersController.show);
// Perfil do usuario logado
router.get("/users/profile", ensureAuth, usersController.show);
// Atualizar usuario logado (alias de /users/profile)
router.put("/users/current", ensureAuth, usersController.update);
// Atualizar perfil do usuario logado
router.put("/users/profile", ensureAuth, usersController.update);
// Buscar usuario por id
router.get("/users/:id", ensureAuth, usersController.getById);
// Atualizar usuario por id (admin/controller)
router.put("/users/:id", ensureAuth, usersController.updateById);
// Atualizar senha do usuario logado
router.put("/users/current/password", ensureAuth, usersController.updatePassword);
// Atualizar senha (alias)
router.put("/users/password", ensureAuth, usersController.updatePassword);
// Listar todos os usuarios
router.get("/users", ensureAuth, usersController.listAll);
// Inativar usuario
router.delete("/users/:id", ensureAuth, usersController.remove);

// ===== Motoristas =====
// Listar motoristas
router.get("/drivers/all", ensureAuth, driversController.listDrivers);
// Criar motorista
router.post("/drivers", ensureAuth, driversController.create);
// Buscar motorista por id
router.get("/drivers/:id", ensureAuth, driversController.getById);
// Atualizar motorista
router.put("/drivers/:id", ensureAuth, driversController.update);
// Inativar motorista
router.delete("/drivers/:id", ensureAuth, driversController.remove);

// ===== Clientes =====
// Listar clientes
router.get("/clients", ensureAuth, clientController.listAll);
// Buscar cliente por id
router.get("/clients/:id", ensureAuth, clientController.getById);
// Criar cliente
router.post("/clients", ensureAuth, clientController.create);
// Atualizar cliente
router.put("/clients/:id", ensureAuth, clientController.update);
// Inativar cliente
router.delete("/clients/:id", ensureAuth, clientController.delete);
// Reativar cliente
router.patch("/clients/:id/reactivate", ensureAuth, clientController.reactivate);

// ===== Entregas =====
// Criar entrega (controller/admin)
router.post("/deliveries", ensureAuth, deliveryController.create);
// Driver aceita entrega
router.post("/deliveries/:deliveryId/assign", ensureAuth, deliveryController.assignToDriver);
// Listar entregas pendentes
router.get("/deliveries/pending", ensureAuth, deliveryController.listPending);
// Listar entregas do driver logado
router.get("/deliveries/my-deliveries", ensureAuth, deliveryController.listByDriver);
// Listar todas as entregas
router.get("/deliveries", ensureAuth, deliveryController.listAll);
// Buscar entrega por id
router.get("/deliveries/:deliveryId", ensureAuth, deliveryController.getById);
// Atualizar entrega
router.put("/deliveries/:deliveryId", ensureAuth, deliveryController.update);
// Remover entrega
router.delete("/deliveries/:deliveryId", ensureAuth, deliveryController.remove);
// Marcar entrega como concluida
router.put("/deliveries/:deliveryId/complete", ensureAuth, deliveryController.completeDelivery);

// ===== (CNH) =====
// Listar todas as licencas
router.get("/licenses", ensureAuth, usersController.listAllLicenses);
// Criar licenca
router.post("/licenses", ensureAuth, licenseController.create);
// Buscar licenca por usuario
router.get("/licenses/user/:userId", ensureAuth, licenseController.getByUser);
// Buscar licenca por id
router.get("/licenses/:id", ensureAuth, licenseController.getById);
// Atualizar licenca
router.put("/licenses/:id", ensureAuth, licenseController.update);
// Remover licenca
router.delete("/licenses/:id", ensureAuth, licenseController.remove);

export { router };