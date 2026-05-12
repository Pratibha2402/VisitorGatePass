import sequelize from "@/app/database/db";
import DataTypes from "sequelize";
export const VisitorGatepassHods = sequelize_misc.define(
  "VisitorGatepassHods",
  {
    rowId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "ROW_ID",
    },
    hodEmpId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "HOD_EMP_ID",
    },
    deptCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "DEPT_CD",
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "UPDATED_BY",
    },
    updatedOn: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "UPDATES_ON",
    },
  },
  {
    tableName: "M_VISITOR_GATEPASS_HODS",
    schema: "MISC",
    timestamps: false,
  }
);