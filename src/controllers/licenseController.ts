import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { License, User } from "../models";

const isControllerOrAdmin = (user: any) => {
  const role = user?.getDataValue ? user.getDataValue('role') : user?.role;
  return role === 'controller' || role === 'admin';
};

export const licenseController = {
  // POST /licenses
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const currentUser = await User.findByPk(userId);
      if (!currentUser) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const {
        name,
        cpf,
        category,
        expiryDate,
        primaryDate,
        mirror,
        numberRegister,
        ear,
        courses,
        userId: driverId,
        licenseUrl,
      } = req.body;

      if (!name || !cpf || !category || !expiryDate || !primaryDate || !mirror || !numberRegister || !driverId) {
        return res.status(400).json({ message: "Campos obrigatorios: name, cpf, category, expiryDate, primaryDate, mirror, numberRegister, userId" });
      }

      if (currentUser.role === 'driver' && String(driverId) !== String(currentUser.id)) {
        return res.status(403).json({ message: "Você só pode cadastrar sua própria CNH" });
      }

      if (currentUser.role !== 'driver' && !isControllerOrAdmin(currentUser)) {
        return res.status(403).json({ message: "Apenas controllers e admins podem criar CNHs para outros usuários" });
      }

      const driver = await User.findByPk(driverId);
      if (!driver || driver.getDataValue('role') !== 'driver') {
        return res.status(400).json({ message: "Motorista invalido" });
      }

      const existing = await License.findOne({ where: { userId: driverId } });
      if (existing) {
        return res.status(400).json({ message: "Este motorista ja possui CNH cadastrada" });
      }

      const created = await License.create({
        name,
        cpf,
        category,
        expiryDate,
        primaryDate,
        mirror,
        numberRegister,
        ear: ear ?? false,
        courses,
        userId: driverId,
        licenseUrl
      });

      const license = await License.findByPk(created.id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }]
      });

      return res.status(201).json(license);
    } catch (error: any) {
      console.error(error);

      if (error?.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro ao criar CNH" });
    }
  },
  // GET /licenses/:id
  async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const currentUser = await User.findByPk(userId);
      if (!currentUser || !isControllerOrAdmin(currentUser)) {
        return res.status(403).json({ message: "Apenas controllers e admins podem acessar CNHs" });
      }

      const { id } = req.params;
      const license = await License.findByPk(id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }]
      });

      if (!license) {
        return res.status(404).json({ message: "CNH não encontrada" });
      }

      return res.json(license);
    } catch (error: any) {
      console.error(error);
      if (error?.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro ao buscar CNH" });
    }
  },

  // GET /licenses/user/:userId
  async getByUser(req: AuthenticatedRequest, res: Response) {
    try {
      const currentUser = req.user;

      if (!currentUser) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const { userId } = req.params;

      if (currentUser.role === 'driver' && String(currentUser.id) !== String(userId)) {
        return res.status(403).json({ message: "Apenas o próprio motorista pode acessar sua CNH" });
      }

      if (currentUser.role !== 'driver' && !isControllerOrAdmin(currentUser)) {
        return res.status(403).json({ message: "Apenas controllers e admins podem acessar CNHs" });
      }

      const license = await License.findOne({
        where: { userId },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }]
      });

      if (!license) {
        return res.status(404).json({ message: "CNH não encontrada" });
      }

      return res.json(license);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar CNH" });
    }
  },

  // PUT /licenses/:id
  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const currentUser = await User.findByPk(userId);
      if (!currentUser) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const { id } = req.params;
      const license = await License.findByPk(id);

      if (!license) {
        return res.status(404).json({ message: "CNH não encontrada" });
      }

      const isOwner = String(license.getDataValue('userId')) === String(currentUser.id);
      const canEdit = isControllerOrAdmin(currentUser) || (currentUser.role === 'driver' && isOwner);

      if (!canEdit) {
        return res.status(403).json({ message: "Você não pode editar esta CNH" });
      }

      const {
        name,
        cpf,
        category,
        expiryDate,
        primaryDate,
        mirror,
        numberRegister,
        ear,
        courses,
        licenseUrl,
      } = req.body;

      await license.update({
        name: name ?? license.name,
        cpf: cpf ?? license.cpf,
        category: category ?? license.category,
        expiryDate: expiryDate ?? license.expiryDate,
        primaryDate: primaryDate ?? license.primaryDate,
        mirror: mirror ?? license.mirror,
        numberRegister: numberRegister ?? license.numberRegister,
        ear: ear ?? license.ear,
        courses: courses ?? license.courses,
        licenseUrl: licenseUrl ?? license.licenseUrl,
      });

      const updated = await License.findByPk(license.id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }]
      });

      return res.json(updated);
    } catch (error: any) {
      console.error(error);

      if (error?.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro ao atualizar CNH" });
    }
  },

  // DELETE /licenses/:id
  async remove(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const currentUser = await User.findByPk(userId);
      if (!currentUser || !isControllerOrAdmin(currentUser)) {
        return res.status(403).json({ message: "Apenas controllers e admins podem apagar CNHs" });
      }

      const { id } = req.params;
      const license = await License.findByPk(id);

      if (!license) {
        return res.status(404).json({ message: "CNH não encontrada" });
      }

      await license.destroy();
      return res.status(204).send();
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao apagar CNH" });
    }
  }
};
