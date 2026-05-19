import { sequelize_misc } from "@/app/database/db";
import { DataTypes } from "sequelize";


export const VisitorsAdmin = sequelize_misc.define(
  "VISITOR_ADMINS",
  {
    empNo: {
      type: DataTypes.INTEGER,
       primaryKey: true,
      field: "EMPNO",
    },
    status: {
      type: DataTypes.INTEGER,
      field: "STATUS",
    },

  },
  {
    tableName: "VISITOR_ADMINS",
    schema: "MISC",
    timestamps: false,
  }
);

