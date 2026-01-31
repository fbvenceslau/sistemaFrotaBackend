import express from "express";
import { authController } from "./controllers/authController";
import { usersController } from "./controllers/usersController";
import { deliveryController } from "./controllers/deliveryController";
import { ensureAuth } from "./middlewares/auth";

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/login-controller", authController.loginController);

router.get("/users/current", ensureAuth, usersController.show);
router.put("/users/current", ensureAuth, usersController.update);
router.put("/users/current/password", ensureAuth, usersController.updatePassword);

// Rotas de entregas
router.post("/deliveries", ensureAuth, deliveryController.create);
router.get("/deliveries/pending", ensureAuth, deliveryController.listPending);
router.get("/deliveries/my-deliveries", ensureAuth, deliveryController.listByDriver);
router.get("/deliveries", ensureAuth, deliveryController.listAll);
router.post("/deliveries/:deliveryId/assign", ensureAuth, deliveryController.assignToDriver);
router.put("/deliveries/:deliveryId/complete", ensureAuth, deliveryController.completeDelivery);

export { router };