import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export interface Delivery {
  id: number;
  senderName: string;
  senderPhone: number;
  recipientName: string;
  recipientPhone: number;
  address: string;
  city: string;
  zipCode: string;
  packageDescription: string;
  originAddress: string;
  destinationAddress: string;
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedDriverId?: number;
  createdByControllerId: number;
  clientId?: number;
}

export interface DeliveryCreationAttributes extends Optional<Delivery, 'id' | 'assignedDriverId' | 'clientId'> {}

export interface DeliveryInstance extends Model<Delivery, DeliveryCreationAttributes>, Delivery {}

export const Delivery = sequelize.define<DeliveryInstance, Delivery>('Delivery', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  /* =====================
    REMETENTE
  ===================== */
  senderName: {
    allowNull: false,
    type: DataTypes.STRING
  },
  senderPhone: {
    allowNull: false,
    type: DataTypes.STRING
  },
  /* =====================
      DESTINATÁRIO
  ===================== */
  recipientName: {
    allowNull: false,
    type: DataTypes.STRING
  },
  recipientPhone: {
    allowNull: false,
    type: DataTypes.STRING
  },
  /* =====================
    ENDEREÇO PADRÃO
  ===================== */
  address: {
    allowNull: false,
    type: DataTypes.STRING
  },
  city: {
    allowNull: false,
    type: DataTypes.STRING
  },
  zipCode: {
    allowNull: false,
    type: DataTypes.STRING
  },
  /* =====================
    ENTREGA
  ===================== */
  packageDescription: {
    allowNull: false,
    type: DataTypes.STRING
  },
  originAddress: {
    allowNull: false,
    type: DataTypes.STRING
  },
  destinationAddress: {
    allowNull: false,
    type: DataTypes.STRING
  },
  /* =====================
    ENTREGA
  ===================== */
  originLatitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    field: "origin_latitude",
  },

  originLongitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    field: "origin_longitude",
  },

  destinationLatitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    field: "destination_latitude",
  },

  destinationLongitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    field: "destination_longitude",
  },
  status: {
    allowNull: false,
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  assignedDriverId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  createdByControllerId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  /* =====================
    CLIENTE
  ===================== */
  clientId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: 'clients',
      key: 'id'
    },
    field: 'client_id'
  }
}, {
  timestamps: true
});
