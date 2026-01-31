import { Request, Response } from "express";
import { Delivery, User } from "../models";

export const deliveryController = {
  // Controller cria uma nova entrega
  async create(req: Request, res: Response) {
    try {
      const { 
        recipientName, 
        recipientPhone, 
        address, 
        city, 
        zipCode, 
        packageDescription,
        originLatitude,
        originLongitude,
        destinationLatitude,
        destinationLongitude
      } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      // Verificar se o usuário é controller ou admin
      const user = await User.findByPk(userId);
      if (!user || (user.getDataValue('role') !== 'controller' && user.getDataValue('role') !== 'admin')) {
        return res.status(403).json({ message: "Apenas controllers e admins podem criar entregas" });
      }

      const delivery = await Delivery.create({
        recipientName,
        recipientPhone,
        address,
        city,
        zipCode,
        packageDescription,
        originLatitude,
        originLongitude,
        destinationLatitude,
        destinationLongitude,
        status: 'pending',
        createdByControllerId: userId
      });

      res.status(201).json(delivery);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar entrega" });
    }
  },

  // Listar todas as entregas pendentes (para driver escolher)
  async listPending(req: Request, res: Response) {
    try {
      const deliveries = await Delivery.findAll({
        where: { status: 'pending' },
        include: [
          {
            model: User,
            as: 'createdByController',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      res.json(deliveries);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao listar entregas" });
    }
  },

  // Driver aceita uma entrega
  async assignToDriver(req: Request, res: Response) {
    try {
      const { deliveryId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      // Verificar se o usuário é driver
      const user = await User.findByPk(userId);
      if (!user || user.getDataValue('role') !== 'driver') {
        return res.status(403).json({ message: "Apenas drivers podem aceitar entregas" });
      }

      const delivery = await Delivery.findByPk(deliveryId);
      if (!delivery) {
        return res.status(404).json({ message: "Entrega não encontrada" });
      }

      if (delivery.status !== 'pending') {
        return res.status(400).json({ message: "Esta entrega não está mais disponível" });
      }

      await delivery.update({
        assignedDriverId: userId,
        status: 'in_progress'
      });

      res.json(delivery);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao aceitar entrega" });
    }
  },

  // Driver marca entrega como completa
  async completeDelivery(req: Request, res: Response) {
    try {
      const { deliveryId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const delivery = await Delivery.findByPk(deliveryId);
      if (!delivery) {
        return res.status(404).json({ message: "Entrega não encontrada" });
      }

      if (delivery.getDataValue('assignedDriverId') !== userId) {
        return res.status(403).json({ message: "Você não está designado para esta entrega" });
      }

      await delivery.update({ status: 'completed' });

      res.json(delivery);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao completar entrega" });
    }
  },

  // Listar entregas do driver logado
  async listByDriver(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const deliveries = await Delivery.findAll({
        where: { assignedDriverId: userId }
      });

      res.json(deliveries);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao listar entregas" });
    }
  },

  // Listar todas as entregas (para controller ver status)
  async listAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const user = await User.findByPk(userId);
      if (!user || (user.getDataValue('role') !== 'controller' && user.getDataValue('role') !== 'admin')) {
        return res.status(403).json({ message: "Apenas controllers e admins podem listar todas as entregas" });
      }

      const deliveries = await Delivery.findAll({
        include: [
          {
            model: User,
            as: 'driver',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      res.json(deliveries);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao listar entregas" });
    }
  }
};
