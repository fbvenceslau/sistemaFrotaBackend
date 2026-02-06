import { ResourceOptions, ValidationError } from "adminjs";
import { User } from "../../models";

const userResourceOptions: ResourceOptions = {
  navigation: 'Administração',
  properties: {
    /* =====================
        DADOS PESSOAIS
    ===================== */
    phone: {
      type: 'string'
    },
    birth: {
      type: 'date'
    },

    /* =====================
        AUTENTICAÇÃO
    ===================== */
    password: {
      type: 'password'
    },

    /* =====================
        PERMISSÕES
    ===================== */
    role: {
      availableValues: [
        { value: 'admin', label: 'Administrador' },
        { value: 'controller', label: 'Controlador' },
        { value: 'driver', label: 'Motorista (padrão)' },
      ]
    },
    active: {
      type: 'boolean'
    },

    /* =====================
        AUDITORIA
    ===================== */
    createdAt: {
      type: 'datetime',
      isVisible: { list: true, show: true, edit: false, filter: false }
    },
    updatedAt: {
      type: 'datetime',
      isVisible: { list: false, show: true, edit: false, filter: false }
    }
  },
  editProperties: [
    'firstName',
    'lastName',
    'phone',
    'birth',
    'email',
    'password',
    'role',
    'active'
  ],
  filterProperties: [
    'firstName',
    'lastName',
    'email',
    'role',
    'active',
    'createdAt'
  ],
  listProperties: [
    'firstName',
    'email',
    'role',
    'active',
    'createdAt'
  ],
  showProperties: [
    'firstName',
    'lastName',
    'phone',
    'birth',
    'email',
    'role',
    'active',
    'createdAt',
    'updatedAt'
  ],
  actions: {
    new: {
      isVisible: true,
      before: async (request: any) => {
        if (!request.payload) {
          return request;
        }

        const payload = request.payload;

        // DEFINE O VALOR PADRÃO DE 'role' COMO 'driver' SE NÃO FOR INFORMADO
        if (!payload.role) {
          payload.role = 'driver';
          console.log('[AdminJS] Default role set to driver');
        }

        // VALIDAR SE O EMAIL JÁ EXISTE
        if (payload.email) {
          const existingUser = await User.findOne({
            where: { email: payload.email }
          });

          if (existingUser) {
            throw new ValidationError({
              email: { message: 'Este e-mail já está cadastrado no sistema' }
            });
          }
        }

        return request;
      }
    },
    edit: {
      isVisible: true,
      before: async (request: any, context: any) => {
        if (!request.payload) {
          return request;
        }

        const payload = request.payload;

        // VALIDAR SE O EMAIL JÁ EXISTE (EXCLUINDO O PRÓPRIO USUÁRIO)
        if (payload.email) {
          const existingUser = await User.findOne({
            where: { email: payload.email }
          });

          const currentId = context?.record?.params?.id;

          // SE ENCONTROU UM USUÁRIO COM ESSE EMAIL E NÃO É O MESMO QUE ESTÁ SENDO EDITADO
          if (existingUser && String(existingUser.id) !== String(currentId)) {
            throw new ValidationError({
              email: { message: 'Este e-mail já está cadastrado no sistema' }
            });
          }
        }

        return request;
      }
    },
    delete: {
      isVisible: true,
    },
    list: {
      isVisible: true,
    },
    show: {
      isVisible: true,
    },
  }
}

export { userResourceOptions };