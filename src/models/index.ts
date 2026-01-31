import { User } from "./User";
import { Delivery } from "./Delivery";

// Controller que criou a entrega
Delivery.belongsTo(User, {
  foreignKey: "createdByControllerId",
  as: "createdByController",
});

// Driver responsável pela entrega
Delivery.belongsTo(User, {
  foreignKey: "assignedDriverId",
  as: "driver",
});

// (opcional, mas recomendado)
User.hasMany(Delivery, {
  foreignKey: "createdByControllerId",
  as: "createdDeliveries",
});

User.hasMany(Delivery, {
  foreignKey: "assignedDriverId",
  as: "assignedDeliveries",
});

export {
  User,
  Delivery,
};
