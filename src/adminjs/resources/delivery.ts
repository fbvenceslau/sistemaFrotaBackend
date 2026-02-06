import { ResourceOptions } from "adminjs";

const deliveryResourceOptions: ResourceOptions = {
  navigation: {
    name: "Entregas",
    icon: "Truck",
  },
  properties: {
    id: {
      isVisible: false,
    },

    /* =====================
        RELACIONAMENTOS
    ===================== */
    clientId: {
      reference: "clients",
      position: 1,
    },

    assignedDriverId: {
      reference: "users",
      position: 2,
    },

    createdByControllerId: {
      reference: "users",
      position: 3,
      isRequired: true,
    },

    /* =====================
        REMETENTE
    ===================== */
    senderName: {
      position: 4,
    },

    senderPhone: {
      position: 5,
    },

    /* =====================
        DESTINATÁRIO
    ===================== */
    recipientName: {
      position: 6,
    },

    recipientPhone: {
      position: 7,
    },

    /* =====================
        ENDEREÇO PADRÃO
    ===================== */
    address: {
      position: 8,
    },

    city: {
      position: 9,
    },

    zipCode: {
      position: 10,
    },

    /* =====================
        ENTREGA
    ===================== */
    packageDescription: {
      position: 11,
    },

    originAddress: {
      position: 12,
    },

    destinationAddress: {
      position: 13,
    },

    originLatitude: {
      isVisible: { list: false, edit: false, show: true },
    },

    originLongitude: {
      isVisible: { list: false, edit: false, show: true },
    },

    destinationLatitude: {
      isVisible: { list: false, edit: false, show: true },
    },

    destinationLongitude: {
      isVisible: { list: false, edit: false, show: true },
    },

    status: {
      availableValues: [
        { value: "pending", label: "Pendente" },
        { value: "in_progress", label: "Em andamento" },
        { value: "completed", label: "Concluída" },
        { value: "cancelled", label: "Cancelada" },
      ],
      position: 14,
    },

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
    "clientId",
    "assignedDriverId",
    "senderName",
    "senderPhone",
    "recipientName",
    "recipientPhone",
    "address",
    "city",
    "zipCode",
    "packageDescription",
    "originAddress",
    "destinationAddress",
    "status",
  ],
  filterProperties: [
    "clientId",
    "status",
    "city",
    "assignedDriverId",
    "createdByControllerId",
    "createdAt",
  ],
  listProperties: [
    "clientId",
    "senderName",
    "recipientName",
    "city",
    "status",
    "assignedDriverId",
    "createdAt",
  ],
  showProperties: [
    "clientId",
    "senderName",
    "senderPhone",
    "recipientName",
    "recipientPhone",
    "address",
    "city",
    "zipCode",
    "packageDescription",
    "originAddress",
    "destinationAddress",
    "originLatitude",
    "originLongitude",
    "destinationLatitude",
    "destinationLongitude",
    "status",
    "assignedDriverId",
    "createdByControllerId",
    "createdAt",
    "updatedAt",
  ],
};

export { deliveryResourceOptions };
