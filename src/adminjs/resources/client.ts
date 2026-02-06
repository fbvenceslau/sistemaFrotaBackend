import { ResourceOptions, ValidationError } from "adminjs";
import { Client } from "../../models/Client";

export const clientResourceOptions: ResourceOptions = {
  navigation: "Cadastros",
  
  properties: {
    /* =====================
        IDENTIFICAÇÃO
    ===================== */
    codClient: {
      isVisible: { list: true, show: true, edit: false, filter: false },
    },
    type: {
      type: "string",
      position: 1,
      isRequired: true,
      availableValues: [
        { value: "fisica", label: "Pessoa Física" },
        { value: "juridica", label: "Pessoa Jurídica" },
      ],
    },

    /* =====================
        DADOS PESSOA FÍSICA
    ===================== */
    name: {
      position: 2,
      isRequired: true,
    },
    cpf: {
      type: 'string',
      position: 3,
    },

    /* =====================
        DADOS PESSOA JURÍDICA
    ===================== */
    companyName: {
      position: 4,
    },
    cnpj: {
      type: 'string',
      position: 5,
    },

    /* =====================
        CONTATO
    ===================== */
    email: {
      type: 'string',
      position: 6,
      isRequired: true,
      props: {
        type: 'email',
      },
    },
    phone: {
      type: 'string',
      position: 7,
    },

    /* =====================
        ENDEREÇO
    ===================== */
    address: {
      position: 8,
      isRequired: true,
    },
    city: {
      position: 9,
      isRequired: true,
    },
    state: {
      type: 'string',
      position: 10,
      isRequired: true,
      availableValues: [
        { value: 'AC', label: 'Acre' },
        { value: 'AL', label: 'Alagoas' },
        { value: 'AP', label: 'Amapá' },
        { value: 'AM', label: 'Amazonas' },
        { value: 'BA', label: 'Bahia' },
        { value: 'CE', label: 'Ceará' },
        { value: 'DF', label: 'Distrito Federal' },
        { value: 'ES', label: 'Espírito Santo' },
        { value: 'GO', label: 'Goiás' },
        { value: 'MA', label: 'Maranhão' },
        { value: 'MT', label: 'Mato Grosso' },
        { value: 'MS', label: 'Mato Grosso do Sul' },
        { value: 'MG', label: 'Minas Gerais' },
        { value: 'PA', label: 'Pará' },
        { value: 'PB', label: 'Paraíba' },
        { value: 'PR', label: 'Paraná' },
        { value: 'PE', label: 'Pernambuco' },
        { value: 'PI', label: 'Piauí' },
        { value: 'RJ', label: 'Rio de Janeiro' },
        { value: 'RN', label: 'Rio Grande do Norte' },
        { value: 'RS', label: 'Rio Grande do Sul' },
        { value: 'RO', label: 'Rondônia' },
        { value: 'RR', label: 'Roraima' },
        { value: 'SC', label: 'Santa Catarina' },
        { value: 'SP', label: 'São Paulo' },
        { value: 'SE', label: 'Sergipe' },
        { value: 'TO', label: 'Tocantins' },
      ],
    },
    zipCode: {
      type: 'string',
      position: 11,
      isRequired: true,
    },

    /* =====================
        STATUS
    ===================== */
    active: {
      type: "boolean",
      position: 12,
    },

    /* =====================
        AUDITORIA
    ===================== */
    createdAt: {
      type: "datetime",
      isVisible: { list: true, edit: false, show: true, filter: true },
    },
    updatedAt: {
      type: "datetime",
      isVisible: { list: false, edit: false, show: true, filter: false },
    },
  },

  editProperties: [
    "type",
    "name",
    "cpf",
    "companyName",
    "cnpj",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "zipCode",
    "active",
  ],

  filterProperties: [
    "type",
    "name",
    "email",
    "city",
    "active",
    "createdAt",
  ],

  listProperties: [
    "codClient",
    "name",
    "email",
    "city",
    "type",
    "active",
    "createdAt",
  ],

  showProperties: [
    "codClient",
    "type",
    "name",
    "cpf",
    "companyName",
    "cnpj",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "zipCode",
    "active",
    "createdAt",
    "updatedAt",
  ],

  actions: {
    new: {
      isVisible: true,
      before: async (request: any) => {
        console.log('📋 [BEFORE HOOK] Request iniciado:', {
          method: request.method,
          payload: request.payload,
        });

        if (request.method === 'post' && request.payload) {
          console.log('📝 [BEFORE HOOK] Post request detectado com payload');

          if (typeof request.payload.email === 'string') {
            request.payload.email = request.payload.email.trim();
          }
          if (typeof request.payload.cpf === 'string') {
            request.payload.cpf = request.payload.cpf.trim();
          }
          if (typeof request.payload.cnpj === 'string') {
            request.payload.cnpj = request.payload.cnpj.trim();
          }

          // Gera codClient se não existir
          if (!request.payload.codClient) {
            request.payload.codClient = Client.generateCodClient();
            console.log('🔑 [BEFORE HOOK] codClient gerado:', request.payload.codClient);
          }
          
          // Converte strings vazias em null
          if (request.payload.companyName === '') request.payload.companyName = null;
          if (request.payload.cnpj === '') request.payload.cnpj = null;
          if (request.payload.phone === '') request.payload.phone = null;
          if (request.payload.cpf === '') request.payload.cpf = null;

          const isFisica = request.payload.type === 'fisica';
          const isJuridica = request.payload.type === 'juridica';

          if (request.payload.email) {
            const existingClient = await Client.findOne({
              where: { email: request.payload.email }
            });

            if (existingClient) {
              throw new ValidationError({
                email: { message: 'Este e-mail ja esta cadastrado no sistema' }
              });
            }
          }

          if (isFisica && request.payload.cpf) {
            const existingClient = await Client.findOne({
              where: { cpf: request.payload.cpf }
            });

            if (existingClient) {
              throw new ValidationError({
                cpf: { message: 'Este CPF ja esta cadastrado no sistema' }
              });
            }
          }

          if (isJuridica && request.payload.cnpj) {
            const existingClient = await Client.findOne({
              where: { cnpj: request.payload.cnpj }
            });

            if (existingClient) {
              throw new ValidationError({
                cnpj: { message: 'Este CNPJ ja esta cadastrado no sistema' }
              });
            }
          }
          
          console.log('✅ [BEFORE HOOK] Payload processado:', request.payload);
        }
        
        console.log('📤 [BEFORE HOOK] Request retornado');
        return request;
      },
      after: async (response: any) => {
        console.log('📋 [AFTER HOOK] Response:', {
          status: response.status,
          record: response.record,
        });
        return response;
      },
    },
    edit: {
      isVisible: true,
      before: async (request: any, context: any) => {
        if (typeof request.payload?.email === 'string') {
          request.payload.email = request.payload.email.trim();
        }
        if (typeof request.payload?.cpf === 'string') {
          request.payload.cpf = request.payload.cpf.trim();
        }
        if (typeof request.payload?.cnpj === 'string') {
          request.payload.cnpj = request.payload.cnpj.trim();
        }

        if (request.payload?.companyName === '') request.payload.companyName = null;
        if (request.payload?.cnpj === '') request.payload.cnpj = null;
        if (request.payload?.phone === '') request.payload.phone = null;
        if (request.payload?.cpf === '') request.payload.cpf = null;

        const currentId = context?.record?.params?.id;
        const currentType = context?.record?.params?.type;
        const nextType = request.payload?.type || currentType;
        const isFisica = nextType === 'fisica';
        const isJuridica = nextType === 'juridica';

        if (request.payload?.email) {
          const existingClient = await Client.findOne({
            where: { email: request.payload.email }
          });

          if (existingClient && String(existingClient.id) !== String(currentId)) {
            throw new ValidationError({
              email: { message: 'Este e-mail ja esta cadastrado no sistema' }
            });
          }
        }

        if (isFisica && request.payload?.cpf) {
          const existingClient = await Client.findOne({
            where: { cpf: request.payload.cpf }
          });

          if (existingClient && String(existingClient.id) !== String(currentId)) {
            throw new ValidationError({
              cpf: { message: 'Este CPF ja esta cadastrado no sistema' }
            });
          }
        }

        if (isJuridica && request.payload?.cnpj) {
          const existingClient = await Client.findOne({
            where: { cnpj: request.payload.cnpj }
          });

          if (existingClient && String(existingClient.id) !== String(currentId)) {
            throw new ValidationError({
              cnpj: { message: 'Este CNPJ ja esta cadastrado no sistema' }
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
  },
};
