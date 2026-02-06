import { User } from "./User";
import { Delivery } from "./Delivery";
import { License } from "./License";
import { Client } from "./Client";

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


User.hasOne(License, {
  foreignKey: "userId",
  as: "license",
});

License.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Cliente pode ter várias entregas
Client.hasMany(Delivery, {
  foreignKey: "clientId",
  as: "deliveries",
});

// Entrega pertence a um cliente
Delivery.belongsTo(Client, {
  foreignKey: "clientId",
  as: "client",
});


export {
  User,
  Delivery,
  License,
  Client
};
