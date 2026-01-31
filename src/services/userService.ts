import { User } from "../models";
import { UserCreationAttributes } from "../models/User";

export const userService = {
  findByEmail: async (email: string) => {
    const user = await User.findOne({ 
      where: { 
        email: email 
      } 
    })

    return user;
  },

  create: async (attributes: UserCreationAttributes) => {
    const user = await User.create(attributes);
    return user;
  },

  update: async (id: number, attributes: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    birth?: Date;
    email?: string;
  }) => {
    const [affectedRows, updatedUsers] = await User.update(attributes, {
      where: {
        id: id
      },
      returning: true
    }) 
    
    return updatedUsers[0]
  },

  updatePassword: async (id: number, password: string) => {
    const [affectedRows, updatedUsers] = await User.update({ 
      password: password
    }, {
      where: {
        id: id 
      },
      returning: true, 
      individualHooks: true 
    })

    return updatedUsers[0]
  }
}