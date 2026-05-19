import { sequelize_misc } from "@/app/database/db";
import { DataTypes } from "sequelize";


export const VisitorMultipleDetail = sequelize_misc.define(
  "VisitorMultipleDetail",
  {
    vId: {
      type: DataTypes.INTEGER,
       primaryKey: true,
      field: "V_ID",
    },
    title: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "V_TITLE",
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "V_NAME",
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "V_AGE",
    },
    sex: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "V_SEX",
    },
    nationality: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "V_NATION",
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "V_COUNTRY",
    },
    passportNo: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: "V_PASSPORTNO",
    },
    passportValidity: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "V_PASSPORT_VALIDITY",
    },
    visaNo: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: "V_VISA_NO",
    },
    visaValidity: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "V_VISA_VALIDITY",
    },
  },
  {
    tableName: "VISITORMULTIPLEDETAIL",
    schema: "MISC",
    timestamps: false,
  }
);

