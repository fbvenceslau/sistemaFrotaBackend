import uploadFileFeature from "@adminjs/upload";
import { FeatureType, ResourceOptions, ValidationError } from "adminjs";
import fs from "fs";
import path from "path";
import { License } from "../../models/License";

const uploadsRoot = path.join(__dirname, "../../../uploads");
const licenseUploads = path.join(uploadsRoot, "licenses", "user-");
const tmpUploads = path.join(uploadsRoot, "tmp");

fs.mkdirSync(uploadsRoot, { recursive: true });
fs.mkdirSync(licenseUploads, { recursive: true });
fs.mkdirSync(tmpUploads, { recursive: true });

export const licenseResourceOptions: ResourceOptions = {
  navigation:  "Cadastros",

  properties: {
    /* =====================
        RELACIONAMENTO
    ===================== */
    userId: {
      isVisible: true,
      position: 1,
      isRequired: true,
    },
    userFullName: {
      isVisible: true,
      type: 'string',
    },

    /* =====================
        DADOS PESSOAIS
    ===================== */
    name: {
      isVisible: true,
    },
    cpf: {
      isVisible: true,
    },

    /* =====================
        INFORMAÇÕES DA CNH
    ===================== */
    category: {
      isVisible: true,
    },
    expiryDate: {
      type: 'date',
    },
    primaryDate: {
      type: 'date',
    },
    mirror: {
      isVisible: true,
    },
    numberRegister: {
      isVisible: true,
    },
    ear: {
      isVisible: true,
    },
    courses: {
      isVisible: true,
    },

    /* =====================
        UPLOAD
    ===================== */
    licenseUrl: {
      isVisible: true,
    },

    /* =====================
        AUDITORIA
    ===================== */
    createdAt: {
      type: 'datetime',
    },
    updatedAt: {
      type: 'datetime',
    }
  },

  editProperties: [
    "userId",
    "name",
    "cpf",
    "category",
    "expiryDate",
    "primaryDate",
    "mirror",
    "numberRegister",
    "ear",
    "courses",
    "UploadLicense",
  ],

  listProperties: [
    "id",
    "userFullName",
    "name",
    "cpf",
    "category",
    "expiryDate",
    "ear",
  ],

  filterProperties: [
    "cpf",
    "userId",
  ],

  showProperties: [
    "id",
    "userFullName",
    "userId",
    "name",
    "cpf",
    "category",
    "expiryDate",
    "primaryDate",
    "mirror",
    "numberRegister",
    "ear",
    "courses",
    "licenseUrl",
    "createdAt",
    "updatedAt",
  ],

  actions: {
    list: {
      after: async (response: any) => {
        if (response.records) {
          const { User } = require("../../models");
          for (const record of response.records) {
            const userId = record.params.userId;
            if (userId) {
              const user = await User.findByPk(userId);
              if (user) {
                record.params.userFullName = `${user.firstName} ${user.lastName}`;
              }
            }
          }
        }
        return response;
      },
    },
    show: {
      after: async (response: any) => {
        if (response.record && response.record.params) {
          const { User } = require("../../models");
          const userId = response.record.params.userId;
          if (userId) {
            const user = await User.findByPk(userId);
            if (user) {
              response.record.params.userFullName = `${user.firstName} ${user.lastName}`;
            }
          }
        }
        return response;
      },
    },
    new: {
      before: async (request) => {
        if (!request.payload) {
          return request;
        }

        const payload = request.payload;

        if (payload.userId) {
          const userId = Number(payload.userId);
          const existing = await License.findOne({ where: { userId } });
          if (existing) {
            throw new ValidationError({
              userId: { message: "Este usuario ja possui uma CNH. Use a tela de atualizacao." },
            });
          }
        }

        return request;
      },
    },

    edit: {
      before: async (request, context) => {
        if (!request.payload) {
          return request;
        }

        const payload = request.payload;
        if (payload.userId) {
          const userId = Number(payload.userId);
          const existing = await License.findOne({ where: { userId } });
          const currentId = context?.record?.params?.id;
          if (existing && String(existing.id) !== String(currentId)) {
            throw new ValidationError({
              userId: { message: "Este usuario ja possui uma CNH. Use a tela de atualizacao." },
            });
          }
        }

        return request;
      },
    },
  },

};

export const licenseResourceFeatures: FeatureType[] = [
  uploadFileFeature({
    provider: {
      local: {
        bucket: uploadsRoot,
      },
    },

    // validation: {
    //   mimeTypes: ["application/pdf"], // apenas PDF
    // },

    properties: {
      file: "UploadLicense", // campo virtual no AdminJS
      key: "licenseUrl",     // coluna real no banco
    },

    uploadPath: (_record, filename) => `licenses/user-/${filename}`
  }),
];