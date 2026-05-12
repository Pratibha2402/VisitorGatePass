import { sequelize_misc } from "@/app/database/db";
import { DataTypes } from "sequelize";

export const VisitorMultiple = sequelize_misc.define(
  "VisitorMultiple",
  {
    vId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "V_ID",
    },
    companyName: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "V_COMPNAME",
    },
    address1: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "V_ADD1",
    },
    address2: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "V_ADD2",
    },
    contact: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "V_CONTACT",
    },
    vehicleNo: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: "V_VEHICLENO",
    },
    purpose: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "V_PURPOSE",
    },
    employeeVisited: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: "V_EMPVISITED",
    },
    visitDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "V_DATE",
    },
    inTime: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: "V_INTIME",
    },
    photo: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: "V_PHOTO",
    },
    outTime: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: "V_OUTTIME",
    },
    createdBy: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: "V_CREATEDBY",
    },
    statusMul: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: "V_STATUSMUL",
    },
    fromDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "V_FROM",
    },
    toDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "V_TO",
    },
    fromTime: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "V_FROMTIME",
    },
    toTime: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "V_TOTIME",
    },
    empVisitedIcom: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "V_EMPVISITEDICOM",
    },
    fileName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "FILENAME",
    },
    material: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: "MATERIAL",
    },
    approvingAuth: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "APPROVING_AUTH",
    },
    approvingStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "APPROVING_STATUS",
    },
    baggageStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: "BAGGAGE_STATUS",
    },
    adminApprovalStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: "ADMIN_APPROVAL_STATUS",
    },
    approvalDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "APPROVAL_DATE",
    },
    gpCreationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "GP_CREATION_DATE",
    },
  },
  {
    tableName: "VISITORMULTIPLE",
    schema: "MISC", // important for Oracle schema
    timestamps: false,
  }
);