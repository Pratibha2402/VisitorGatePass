import { sequelize_misc } from "@/app/database/db";
import { DataTypes } from "sequelize";

export const Employee = sequelize_misc.define(
  "Employee",
  {
    empNo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "EMPNO",
    },
    name: {
      type: DataTypes.STRING(40),
      allowNull: true,
      field: "NAME",
    },
    designation: {
      type: DataTypes.STRING(40),
      allowNull: true,
      field: "DESIG",
    },
    department: {
      type: DataTypes.STRING(40),
      allowNull: true,
      field: "DEPT",
    },
    departmentCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "DEPT_CD",
    },
    grade: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: "GRADE",
    },
    emailId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "EMAILID",
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "GENDER",
    },
    dateOfJoining: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "DOJ",
    },
    dateOfJoiningRnd: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "DOJRND",
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "DOB",
    },
    dateOfJoiningCorporation: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "DOCP",
    },
    firstName: {
      type: DataTypes.STRING(40),
      allowNull: true,
      field: "FNAME",
    },
    lastName: {
      type: DataTypes.STRING(40),
      allowNull: true,
      field: "LNAME",
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "MOBILE",
    },
    nameHindi: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "NAME_HINDI",
    },
    intercom: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "ICOM",
    },
    officeLandline: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "OFFICE_LANDLINE",
    },
    residenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "RESIDENCE_NO",
    },
    currentCity: {
      type: DataTypes.STRING(46),
      allowNull: true,
      field: "CURRENT_CITY",
    },
    companyCode: {
      type: DataTypes.STRING(4),
      allowNull: true,
      field: "COMPANY_CODE",
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "USERNAME",
    },
    departmentCodeUnique: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "DEPT_CD_UNIQUE",
    },
    dojCurrentGrade: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "DOJ_CURRENT_GRADE",
    },
    controllingOfficer: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "CONTROLLING_OFFICER",
    },
    rndStatus: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: "RND_STATUS",
    },
    isEmployee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "IS_EMPLOYEE",
    },
  },
  {
    tableName: "M_EMPLOYEE_ALL",
    timestamps: false,
  }
);
