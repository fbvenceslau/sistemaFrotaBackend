import { Request, Response } from "express";
import { userService } from "../services/userService";
import { jwtService } from "../services/jwtService";

export const authController = {
  // POST /auth/register
  register: async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, phone, birth } = req.body;
    
    try {
      const userAlreadyExists = await userService.findByEmail(email);

      if (userAlreadyExists) {
        throw new Error('E-mail já cadastrado.');
      }

      const user = await userService.create({
        firstName,
        lastName,
        email,
        password,
        phone,
        birth,
        role: "driver"
      });

      return res.status(201).json(user);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  // POST /auth/login
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await userService.findByEmail(email);
      
      if (!user) return res.status(404).json({ message: 'E-mail não encontrado.' });

      user.checkPassword(password, (err, isSame) => {
        if (err) return res.status(400).json({ message: err.message });  
        if (!isSame) return res.status(401).json({ message: 'Senha incorreta.' });

        const payload = {
          id: user.id,
          firstName: user.firstName,
          email: user.email
        };

        const token = jwtService.signToken(payload, '1d')

        return res.json({ authenticated: true, ...payload, token})
      })
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  // POST /auth/login-controller
  loginController: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await userService.findByEmail(email);
      
      if (!user) return res.status(404).json({ message: 'E-mail não encontrado.' });

      // Validar se é admin ou controller
      if (user.role !== 'admin' && user.role !== 'controller') {
        return res.status(403).json({ message: 'Acesso negado. Apenas admin e controllers podem acessar.' });
      }

      user.checkPassword(password, (err, isSame) => {
        if (err) return res.status(400).json({ message: err.message });  
        if (!isSame) return res.status(401).json({ message: 'Senha incorreta.' });

        const payload = {
          id: user.id,
          firstName: user.firstName,
          email: user.email,
          role: user.role
        };

        const token = jwtService.signToken(payload, '1d')

        return res.json({ authenticated: true, ...payload, token})
      })
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  }
};