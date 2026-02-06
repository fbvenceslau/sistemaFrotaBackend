import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";
import bcrypt from "bcrypt";
import { isValidPhone } from "../utils/validators";

type CheckPasswordCallback = (err?: Error, isSame?: boolean) => void;

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  birth: Date;
  email: string;
  password: string;
  role: 'admin' | 'controller' | 'driver';
  active: boolean;
}

export interface UserCreationAttributes extends Optional<User, 'id'> {}

export interface UserInstance extends Model<User, UserCreationAttributes>, User {
  checkPassword: (password: string, callbackfn: CheckPasswordCallback) => void;
}

export const User = sequelize.define<UserInstance, User>('User', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  firstName: {
    allowNull: false,
    type: DataTypes.STRING
  },
  lastName: {
    allowNull: false,
    type: DataTypes.STRING
  },
  phone: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      customValidator(value: string) {
        if (!isValidPhone(value)) {
          throw new Error('Telefone inválido. Use formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX');
        }
      }
    }
  },
  birth: {
    allowNull: false,
    type: DataTypes.DATE
  },
  email: {
    allowNull: false,
    unique: {
      name: 'unique_email',
      msg: 'Este e-mail já está cadastrado no sistema'
    },
    type: DataTypes.STRING,
    validate: {
      isEmail: {
        msg: 'E-mail inválido'
      }
    }
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'driver',
    validate: {
      isIn: {
        args: [['admin', 'controller', 'driver']],
        msg: 'Perfil inválido. Opções: admin, controller, driver'
      }
    }
  },
  active: {
    allowNull: false,
    defaultValue: false,
    type: DataTypes.BOOLEAN
  }
}, {
  hooks: {
    beforeSave: async (user) => {
      try {
        console.log('[User Hook] beforeSave triggered', { 
          isNewRecord: user.isNewRecord, 
          changedPassword: user.changed('password'),
          email: user.email 
        });
        
        if (user.isNewRecord || user.changed('password')) {
          console.log('[User Hook] Hashing password...');
          user.password = await bcrypt.hash(user.password.toString(), 10);
          console.log('[User Hook] Password hashed successfully');
        }
      } catch (error) {
        console.error('[User Hook] Error in beforeSave:', error);
        throw error;
      }
    }
  }
})

User.prototype.checkPassword = function (password: string, callbackfn: CheckPasswordCallback ) {
  bcrypt.compare(password, this.password, (err, isSame) => {
    if (err) {
      callbackfn(err, false)
    } else {
      callbackfn(err, isSame)
    }
  })
}