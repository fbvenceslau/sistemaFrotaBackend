import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { License, User } from "../models";

export const driversController = {
// LISTAR OS MOTORISTAS /drivers/all
  async listDrivers(_req: AuthenticatedRequest, res: Response) {
    try {
      const drivers = await User.findAll({
        where: { role: 'driver' },
        attributes: ['id', 'firstName', 'lastName']
      });

      res.json(drivers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao listar os motoristas" });
    }
  },

  // POST /drivers - criar motorista
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const currentUser = await User.findByPk(userId);
      if (!currentUser || (currentUser.getDataValue('role') !== 'controller' && currentUser.getDataValue('role') !== 'admin')) {
        return res.status(403).json({ message: "Apenas controllers e admins podem criar motoristas" });
      }

      const {
        firstName,
        lastName,
        email,
        password,
        phone,
        birth,
        active
      } = req.body;

      if (!firstName || !lastName || !email || !password || !phone || !birth) {
        return res.status(400).json({ message: "Campos obrigatorios: firstName, lastName, email, password, phone, birth" });
      }

      const created = await User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
        birth,
        role: 'driver',
        active: active ?? true
      });

      const driver = await User.findOne({
        where: { id: created.id },
        attributes: { exclude: ['password'] },
        include: [{
          model: License,
          as: 'license',
          required: false
        }]
      });

      return res.status(201).json(driver);
    } catch (error: any) {
      console.error(error);

      if (error?.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Este e-mail já está cadastrado' });
      }

      if (error?.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro ao criar motorista" });
    }
  },

  // GET /drivers/:id - detalhes do motorista
  async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const currentUser = await User.findByPk(userId);
      if (!currentUser || (currentUser.getDataValue('role') !== 'controller' && currentUser.getDataValue('role') !== 'admin')) {
        return res.status(403).json({ message: "Apenas controllers e admins podem acessar motoristas" });
      }

      const { id } = req.params;
      const driver = await User.findOne({
        where: { id, role: 'driver' },
        attributes: { exclude: ['password'] },
        include: [{
          model: License,
          as: 'license',
          required: false
        }]
      });

      if (!driver) {
        return res.status(404).json({ message: "Motorista não encontrado" });
      }

      return res.json(driver);
    } catch (error: any) {
      console.error(error);

      if (error?.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro ao buscar motorista" });
    }
  },

  // PUT /drivers/:id - atualizar motorista
  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const currentUser = await User.findByPk(userId);
      if (!currentUser || (currentUser.getDataValue('role') !== 'controller' && currentUser.getDataValue('role') !== 'admin')) {
        return res.status(403).json({ message: "Apenas controllers e admins podem editar motoristas" });
      }

      const { id } = req.params;
      const driver = await User.findOne({ where: { id, role: 'driver' } });

      if (!driver) {
        return res.status(404).json({ message: "Motorista não encontrado" });
      }

      const {
        firstName,
        lastName,
        phone,
        birth,
        email,
        active
      } = req.body;

      await driver.update({
        firstName: firstName ?? driver.firstName,
        lastName: lastName ?? driver.lastName,
        phone: phone ?? driver.phone,
        birth: birth ?? driver.birth,
        email: email ?? driver.email,
        active: active ?? driver.active,
      });

      const updated = await User.findOne({
        where: { id: driver.id },
        attributes: { exclude: ['password'] },
        include: [{
          model: License,
          as: 'license',
          required: false
        }]
      });

      return res.json(updated);
    } catch (error: any) {
      console.error(error);

      if (error?.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Este e-mail já está cadastrado' });
      }

      if (error?.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro ao atualizar motorista" });
    }
  },

  // DELETE /drivers/:id - inativar motorista
  async remove(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const currentUser = await User.findByPk(userId);
      if (!currentUser || (currentUser.getDataValue('role') !== 'controller' && currentUser.getDataValue('role') !== 'admin')) {
        return res.status(403).json({ message: "Apenas controllers e admins podem inativar motoristas" });
      }

      const { id } = req.params;
      const driver = await User.findOne({ where: { id, role: 'driver' } });

      if (!driver) {
        return res.status(404).json({ message: "Motorista não encontrado" });
      }

      await driver.update({ active: false });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao inativar motorista" });
    }
  }
}

