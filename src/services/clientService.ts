import { Client } from '../models/Client';

export const clientService = {
  /**
   * Listar todos os clientes
   */
  findAll: async () => {
    return await Client.findAll({
      where: { active: true },
      order: [['createdAt', 'DESC']],
    });
  },

  /**
   * Buscar cliente por ID
   */
  findById: async (id: number) => {
    return await Client.findByPk(id);
  },

  /**
   * Buscar cliente por email
   */
  findByEmail: async (email: string) => {
    return await Client.findOne({
      where: { email },
    });
  },

  /**
   * Buscar cliente por CPF (pessoa física)
   */
  findByCpf: async (cpf: string) => {
    return await Client.findOne({
      where: { cpf },
    });
  },

  /**
   * Buscar cliente por CNPJ (pessoa jurídica)
   */
  findByCnpj: async (cnpj: string) => {
    return await Client.findOne({
      where: { cnpj },
    });
  },

  /**
   * Buscar cliente por código
   */
  findByCodClient: async (codClient: string) => {
    return await Client.findOne({
      where: { codClient },
    });
  },

  /**
   * Criar novo cliente
   */
  create: async (data: any) => {
    const codClient = Client.generateCodClient();
    return await Client.create({
      ...data,
      codClient,
    });
  },

  /**
   * Atualizar cliente
   */
  update: async (id: number, data: any) => {
    const client = await Client.findByPk(id);
    
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    return await client.update(data);
  },

  /**
   * Deletar cliente (soft delete)
   */
  delete: async (id: number) => {
    const client = await Client.findByPk(id);
    
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    return await client.update({ active: false });
  },

  /**
   * Reativar cliente
   */
  reactivate: async (id: number) => {
    const client = await Client.findByPk(id);
    
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    return await client.update({ active: true });
  },
};
