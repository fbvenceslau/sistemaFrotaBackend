import { AuthenticationOptions } from "@adminjs/express";
import { User } from "../models";
import bcrypt from "bcrypt";

export const authenticationOptions: AuthenticationOptions = {
  authenticate: async (email, password) => {
    try {
      const user = await User.findOne({ where: { email: email } });

      if (user && user.role === 'admin') {
        const matched = await bcrypt.compare(password, user.password);
        
        if (matched) {
          return user;
        }
      }

      return false;
    } catch (error) {
      console.error('[AdminJS Auth Error]', error);
      // Retorna false para não expor detalhes do erro ao usuário
      return false;
    }
  },
  cookiePassword: process.env.COOKIE_SECRET || "fallback-secret-key-change-in-production-min-32-chars",
}