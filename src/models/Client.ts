import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database';
import crypto from 'crypto';

interface ClientAttributes {
  id: number;
  codClient: string;
  type: 'fisica' | 'juridica';
  name: string;
  cpf?: string | null;
  companyName?: string | null;
  cnpj?: string | null;
  email: string;
  phone?: string | null;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ClientCreationAttributes extends Optional<ClientAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  declare id: number;
  declare codClient: string;
  declare type: 'fisica' | 'juridica';
  declare name: string;
  declare cpf: string | null;
  declare companyName: string | null;
  declare cnpj: string | null;
  declare email: string;
  declare phone: string | null;
  declare address: string;
  declare city: string;
  declare state: string;
  declare zipCode: string;
  declare active: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static generateCodClient(): string {
    return crypto.randomBytes(6).toString('hex').toUpperCase();
  }
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codClient: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      field: 'cod_client',
    },
    type: {
      type: DataTypes.ENUM('fisica', 'juridica'),
      allowNull: false,
      defaultValue: 'fisica',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'company_name',
    },
    cnpj: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'zip_code',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    modelName: 'Client',
    tableName: 'clients',
    underscored: true,
    timestamps: true,
  }
);

export default Client;
