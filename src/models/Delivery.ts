import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export interface Delivery {
  id: number;
  recipientName: string;
  recipientPhone: string;
  address: string;
  city: string;
  zipCode: string;
  packageDescription: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  assignedDriverId?: number;
  createdByControllerId: number;

}

export interface DeliveryCreationAttributes extends Optional<Delivery, 'id' | 'assignedDriverId'> {}

export interface DeliveryInstance extends Model<Delivery, DeliveryCreationAttributes>, Delivery {}

export const Delivery = sequelize.define<DeliveryInstance, Delivery>('Delivery', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  recipientName: {
    allowNull: false,
    type: DataTypes.STRING
  },
  recipientPhone: {
    allowNull: false,
    type: DataTypes.STRING
  },
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
  packageDescription: {
    allowNull: false,
    type: DataTypes.STRING
  },
  status: {
    allowNull: false,
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  originLatitude: {
    allowNull: false,
    type: DataTypes.FLOAT
  },
  originLongitude: {
    allowNull: false,
    type: DataTypes.FLOAT
  },
  destinationLatitude: {
    allowNull: false,
    type: DataTypes.FLOAT
  },
  destinationLongitude: {
    allowNull: false,
    type: DataTypes.FLOAT
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
  }
}, {
  timestamps: true
});
