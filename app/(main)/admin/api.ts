"use server";

import { Op, QueryTypes } from "sequelize";
import { sequelize_misc } from "@/app/database/db";
import { VisitorMultiple } from "@/app/database/models/Visitor_Master";
import { VisitorMultipleDetail } from "@/app/database/models/VisitorMultipleDetails";
import { Employee } from "@/app/database/models/Employee";
import { VisitorGatepassHods } from "@/app/database/models/VisitorGatePassHOD";
import { VisitorGatepassVehicleHods } from "@/app/database/models/VisitorGatePassVehicleHOD";
import "@/app/database/models/associations";
import { GATEPASS_APPROVAL_STATUS } from "@/app/enum";

const includeVisitorDetails = [
  {
    model: VisitorMultipleDetail,
    as: "details",
    required: true,
  },
  {
    model: Employee,
    as: "visitedEmployee",
    attributes: ["empNo", "username", "name", "designation", "department"],
    required: false,
  },
];

export async function fetchAllPendingGatePassesForAdmin() {
  const rows = await VisitorMultiple.findAll({
    where: {
      approvingStatus: {
        [Op.or]: [null, GATEPASS_APPROVAL_STATUS.PENDING],
      },
    },
    include: includeVisitorDetails,
    order: [["gpCreationDate", "DESC"]],
  });

  return rows.map((row: any) => row.get({ plain: true }));
}

export async function fetchAllGatePassReports() {
  const rows = await VisitorMultiple.findAll({
    include: includeVisitorDetails,
    order: [["gpCreationDate", "DESC"]],
  });

  return rows.map((row: any) => row.get({ plain: true }));
}

export async function searchEmployees(query: string) {
  if (!query?.trim()) return [];

  return sequelize_misc.query(
    `
    SELECT
      EMPNO AS "empNo",
      NAME AS "name",
      DESIG AS "designation",
      DEPT AS "department",
      DEPT_CD AS "deptCode",
      GRADE AS "grade"
    FROM MISC.M_EMPLOYEE_ALL
    WHERE RND_STATUS = 'ACTIVE'
      AND IS_EMPLOYEE = 1
      AND (
        LOWER(NAME) LIKE LOWER(:search)
        OR TO_CHAR(EMPNO) LIKE :search
      )
    ORDER BY NAME
    `,
    {
      replacements: {
        search: `%${query}%`,
      },
      type: QueryTypes.SELECT,
    },
  );
}

export async function fetchDepartments() {
  return sequelize_misc.query(
    `
    SELECT DISTINCT
      DEPT_CD AS "deptCode",
      DEPT AS "department"
    FROM MISC.M_EMPLOYEE_ALL
    WHERE DEPT_CD IS NOT NULL
      AND DEPT IS NOT NULL
      AND RND_STATUS = 'ACTIVE'
    ORDER BY DEPT
    `,
    {
      type: QueryTypes.SELECT,
    },
  );
}

export async function fetchNormalApproverAuthorizations() {
  const rows = await VisitorGatepassHods.findAll({
    order: [["rowId", "DESC"]],
  });

  return rows.map((row: any) => row.get({ plain: true }));
}

export async function fetchVehicleApproverAuthorizations() {
  const rows = await VisitorGatepassVehicleHods.findAll({
    order: [["rowId", "DESC"]],
  });

  return rows.map((row: any) => row.get({ plain: true }));
}