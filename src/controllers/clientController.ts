import { Request, Response } from 'express';
import { clientService } from '../services/clientService';

export const clientController = {
  /**
   * GET /clients - Listar todos os clientes ativos
   */
  listAll: async (_req: Request, res: Response) => {
    try {
      const clients = await clientService.findAll();
      return res.status(200).json(clients);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  /**
   * GET /clients/:id - Buscar cliente por ID
   */
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const client = await clientService.findById(Number(id));

      if (!client) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }

      return res.status(200).json(client);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  /**
   * POST /clients - Criar novo cliente
   */
  create: async (req: Request, res: Response) => {
    try {
      const {
        type,
        name,
        cpf,
        companyName,
        cnpj,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
      } = req.body;

      // Validações básicas
      if (!type || !name || !email || !address || !city || !state || !zipCode) {
        return res.status(400).json({
          message: 'Campos obrigatórios faltando: type, name, email, address, city, state, zipCode',
        });
      }

      // Validar tipo
      if (!['fisica', 'juridica'].includes(type)) {
        return res.status(400).json({ message: 'Type deve ser "fisica" ou "juridica"' });
      }

      // Validar email duplicado
      const existingEmail = await clientService.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Este email já está cadastrado' });
      }

      // Validar CPF duplicado (pessoa física)
      if (type === 'fisica' && cpf) {
        const existingCpf = await clientService.findByCpf(cpf);
        if (existingCpf) {
          return res.status(400).json({ message: 'Este CPF já está cadastrado' });
        }
      }

      // Validar CNPJ duplicado (pessoa jurídica)
      if (type === 'juridica' && cnpj) {
        const existingCnpj = await clientService.findByCnpj(cnpj);
        if (existingCnpj) {
          return res.status(400).json({ message: 'Este CNPJ já está cadastrado' });
        }
      }

      const client = await clientService.create({
        type,
        name,
        cpf: type === 'fisica' ? cpf : null,
        companyName: type === 'juridica' ? companyName : null,
        cnpj: type === 'juridica' ? cnpj : null,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
      });

      return res.status(201).json(client);
    } catch (err: any) {
      console.error('Erro ao criar cliente:', err);
      
      // Erros de validação do Sequelize
      if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map((e: any) => ({
          field: e.path,
          message: e.message
        }));
        return res.status(400).json({ message: 'Erros de validação', errors });
      }
      
      // Erro de unique constraint
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Este registro já existe no sistema' });
      }
      
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  /**
   * PUT /clients/:id - Atualizar cliente
   */
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {
        type,
        name,
        cpf,
        companyName,
        cnpj,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        active,
      } = req.body;

      const client = await clientService.findById(Number(id));
      if (!client) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }

      // Validar email duplicado (se mudou)
      if (email && email !== client.email) {
        const existingEmail = await clientService.findByEmail(email);
        if (existingEmail) {
          return res.status(400).json({ message: 'Este email já está cadastrado' });
        }
      }

      // Validar CPF duplicado (se mudou)
      if (type === 'fisica' && cpf && cpf !== client.cpf) {
        const existingCpf = await clientService.findByCpf(cpf);
        if (existingCpf) {
          return res.status(400).json({ message: 'Este CPF já está cadastrado' });
        }
      }

      // Validar CNPJ duplicado (se mudou)
      if (type === 'juridica' && cnpj && cnpj !== client.cnpj) {
        const existingCnpj = await clientService.findByCnpj(cnpj);
        if (existingCnpj) {
          return res.status(400).json({ message: 'Este CNPJ já está cadastrado' });
        }
      }

      const updatedClient = await clientService.update(Number(id), {
        type: type || client.type,
        name: name || client.name,
        cpf: cpf !== undefined ? cpf : client.cpf,
        companyName: companyName !== undefined ? companyName : client.companyName,
        cnpj: cnpj !== undefined ? cnpj : client.cnpj,
        email: email || client.email,
        phone: phone !== undefined ? phone : client.phone,
        address: address || client.address,
        city: city || client.city,
        state: state || client.state,
        zipCode: zipCode || client.zipCode,
        active: active !== undefined ? active : client.active,
      });

      return res.status(200).json(updatedClient);
    } catch (err: any) {
      console.error('Erro ao atualizar cliente:', err);
      
      // Erros de validação do Sequelize
      if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map((e: any) => ({
          field: e.path,
          message: e.message
        }));
        return res.status(400).json({ message: 'Erros de validação', errors });
      }
      
      // Erro de unique constraint
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Este registro já existe no sistema' });
      }
      
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  /**
   * DELETE /clients/:id - Deletar cliente (soft delete)
   */
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const client = await clientService.findById(Number(id));
      if (!client) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }

      await clientService.delete(Number(id));
      return res.status(204).send();
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  /**
   * PATCH /clients/:id/reactivate - Reativar cliente
   */
  reactivate: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const client = await clientService.findById(Number(id));
      if (!client) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }

      const reactivatedClient = await clientService.reactivate(Number(id));
      return res.status(200).json(reactivatedClient);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },
};
