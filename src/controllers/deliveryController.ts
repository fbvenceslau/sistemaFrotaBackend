import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { Client, Delivery, User } from "../models";

export const deliveryController = {
  // Controller cria uma nova entrega
  async create(req: Request, res: Response) {
    try {
      const { 
        senderName,
        senderPhone,
        recipientName, 
        recipientPhone, 
        address, 
        city, 
        zipCode, 
        packageDescription,
        originAddress,
        destinationAddress,
        originLatitude,
        originLongitude,
        destinationLatitude,
        destinationLongitude,
        assignedDriverId
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
        senderName,
        senderPhone,
        recipientName,
        recipientPhone,
        address,
        city,
        zipCode,
        packageDescription,
        originAddress,
        destinationAddress,
        status: 'pending',
        createdByControllerId: userId,
        originLatitude,
        originLongitude,
        destinationLatitude,
        destinationLongitude,
        assignedDriverId
      });

      res.status(201).json(delivery);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao criar entrega" });
    }
  },

  // Listar todas as entregas pendentes (para driver escolher)
  async listPending(_req: Request, res: Response) {
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
        ], order: [['updated_at', 'DESC']]
      });

      res.json(deliveries);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao listar entregas" });
    }
  },

  // GET /deliveries/:deliveryId - detalhes da entrega
  async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const user = await User.findByPk(userId);
      if (!user || (user.getDataValue('role') !== 'controller' && user.getDataValue('role') !== 'admin')) {
        return res.status(403).json({ message: "Apenas controllers e admins podem acessar entregas" });
      }

      const { deliveryId } = req.params;
      const delivery = await Delivery.findByPk(deliveryId, {
        include: [
          {
            model: User,
            as: 'driver',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Client,
            as: 'client'
          }
        ]
      });

      if (!delivery) {
        return res.status(404).json({ message: "Entrega não encontrada" });
      }

      return res.json(delivery);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar entrega" });
    }
  },

  // PUT /deliveries/:deliveryId - atualizar entrega
  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const user = await User.findByPk(userId);
      if (!user || (user.getDataValue('role') !== 'controller' && user.getDataValue('role') !== 'admin')) {
        return res.status(403).json({ message: "Apenas controllers e admins podem editar entregas" });
      }

      const { deliveryId } = req.params;
      const delivery = await Delivery.findByPk(deliveryId);

      if (!delivery) {
        return res.status(404).json({ message: "Entrega não encontrada" });
      }

      const {
        senderName,
        senderPhone,
        recipientName,
        recipientPhone,
        address,
        city,
        zipCode,
        packageDescription,
        originAddress,
        destinationAddress,
        originLatitude,
        originLongitude,
        destinationLatitude,
        destinationLongitude,
        assignedDriverId,
        status,
        clientId,
      } = req.body;

      if (status && !['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: "Status inválido" });
      }

      if (assignedDriverId) {
        const assignedDriver = await User.findByPk(assignedDriverId);
        if (!assignedDriver || assignedDriver.getDataValue('role') !== 'driver') {
          return res.status(400).json({ message: "Motorista inválido" });
        }
      }

      await delivery.update({
        senderName: senderName ?? delivery.senderName,
        senderPhone: senderPhone ?? delivery.senderPhone,
        recipientName: recipientName ?? delivery.recipientName,
        recipientPhone: recipientPhone ?? delivery.recipientPhone,
        address: address ?? delivery.address,
        city: city ?? delivery.city,
        zipCode: zipCode ?? delivery.zipCode,
        packageDescription: packageDescription ?? delivery.packageDescription,
        originAddress: originAddress ?? delivery.originAddress,
        destinationAddress: destinationAddress ?? delivery.destinationAddress,
        originLatitude: originLatitude ?? delivery.originLatitude,
        originLongitude: originLongitude ?? delivery.originLongitude,
        destinationLatitude: destinationLatitude ?? delivery.destinationLatitude,
        destinationLongitude: destinationLongitude ?? delivery.destinationLongitude,
        assignedDriverId: assignedDriverId ?? delivery.assignedDriverId,
        status: status ?? delivery.status,
        clientId: clientId ?? delivery.clientId,
      });

      const updated = await Delivery.findByPk(delivery.id, {
        include: [
          {
            model: User,
            as: 'driver',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Client,
            as: 'client'
          }
        ]
      });

      return res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar entrega" });
    }
  },

  // DELETE /deliveries/:deliveryId - apagar entrega
  async remove(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Não autenticado" });
      }

      const user = await User.findByPk(userId);
      if (!user || (user.getDataValue('role') !== 'controller' && user.getDataValue('role') !== 'admin')) {
        return res.status(403).json({ message: "Apenas controllers e admins podem apagar entregas" });
      }

      const { deliveryId } = req.params;
      const delivery = await Delivery.findByPk(deliveryId);

      if (!delivery) {
        return res.status(404).json({ message: "Entrega não encontrada" });
      }

      await delivery.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao apagar entrega" });
    }
  }
};
