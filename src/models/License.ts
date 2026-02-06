import { sequelize } from "../database";
import { DataTypes, Model, Optional } from "sequelize";
import { isValidCPF, isValidCNH } from "../utils/validators";

export interface License {
  id: number
  name: string
  cpf: string
  category: 'ACC' | 'A' | 'B' | 'C' | 'D' | 'E'
  expiryDate: Date
  primaryDate: Date
  mirror: string
  numberRegister: string
  ear: boolean
  courses: string
  userId: number
  licenseUrl: string
}

export interface LicenseCreationAttributes extends Optional<License, "id" | "courses" | "licenseUrl"> {}

export interface LicenseInstance extends Model<License, LicenseCreationAttributes>, License {}

export const License = sequelize.define<LicenseInstance, License>("License", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },

  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  cpf: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      isValidCPF(value: string) {
        if (!isValidCPF(value)) {
          throw new Error('CPF inválido');
        }
      }
    }
  },
  category: {
    allowNull: false,
    type: DataTypes.ENUM(
      'ACC',
      'A',
      'B',
      'C',
      'D',
      'E'
    ),
    validate: {
      isIn: [['ACC', 'A', 'B', 'C', 'D', 'E']]
    }
  },
  expiryDate: {
    allowNull: false,
    field: "expiry_date",
    type: DataTypes.DATE,
  },
  primaryDate: {
    allowNull: false,
    field: "primary_date",
    type: DataTypes.DATE,
  },
  mirror: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  numberRegister: {
    allowNull: false,
    field: "number_register",
    type: DataTypes.STRING,
    validate: {
      isValidCNH(value: string) {
        if (!isValidCNH(value)) {
          throw new Error('Número da CNH inválido');
        }
      }
    }
  },
  ear: {
    allowNull: true,
    defaultValue: false,
    type: DataTypes.BOOLEAN,
  },
  courses: {
    type: DataTypes.STRING,
  },
  userId: {
    allowNull: false,
    unique: true,
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
  },
  licenseUrl: {
    allowNull: true,
    type: DataTypes.STRING,
  },
});
