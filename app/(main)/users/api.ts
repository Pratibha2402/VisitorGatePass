import { QueryTypes } from "sequelize";
import { sequelize_misc } from "@/app/database/db";
import { Op, fn, col, where } from "sequelize";
import { VisitorMultiple } from "@/app/database/models/Visitor_Master";
import { VisitorMultipleDetail } from "@/app/database/models/VisitorMultipleDetails";
import "@/app/database/models/associations";
import dayjs from "dayjs";
import { Employee } from "@/app/database/models/Employee";
import { GATEPASS_APPROVAL_STATUS } from "@/app/enum";
import { sendVisitorGatePassCreatedMail } from "@/app/mail/gatepass-created";



export async function fetchApprovingAuthority(empno: string) {
  const sql = `
WITH emp_dept AS (
  SELECT DEPT_CD_UNIQUE
  FROM M_EMPLOYEE_ALL
  WHERE EMPNO = :empno
)
SELECT DISTINCT
  approver.EMPNO AS "empNo",
  approver.NAME AS "name",
  approver.DESIG AS "designation",
  approver.DEPT AS "department"
FROM (
  SELECT e.EMPNO, e.NAME, e.DESIG, e.DEPT
  FROM M_EMPLOYEE_ALL e
  JOIN emp_dept d ON e.DEPT_CD_UNIQUE = d.DEPT_CD_UNIQUE
  WHERE e.GRADE IN ('D', 'E', 'F', 'G', 'H', 'I')
    AND e.DOJ IS NOT NULL
    AND e.RND_STATUS = :status
    AND e.IS_EMPLOYEE = :isEmployee

  UNION

  SELECT e2.EMPNO, e2.NAME, e2.DESIG, e2.DEPT
  FROM M_VISITOR_GATEPASS_HODS h
  JOIN emp_dept d ON h.DEPT_CD= d.DEPT_CD_UNIQUE
  JOIN M_EMPLOYEE_ALL e2 ON e2.EMPNO = h.HOD_EMP_ID
  WHERE e2.RND_STATUS = :status
    AND e2.IS_EMPLOYEE = :isEmployee
) approver
ORDER BY approver.NAME
  `;

  return sequelize_misc.query(sql, {
    replacements: {
      empno,
      status: "ACTIVE",
      isEmployee: 1,
    },
    type: QueryTypes.SELECT,
  });
}

export async function fetchapprovingAuthorityVehicle(empno: string) {
    const sql = `
      WITH 
emp_base AS (
    -- Get employee base details once
    SELECT 
        EMPNO,
        DEPT_CD_UNIQUE,
        CONTROLLING_OFFICER
    FROM MISC.M_EMPLOYEE_ALL
    WHERE EMPNO = :empno
),

hierarchy (
    EMPNO,
    NAME,
    DESIG,
    DEPT,
    GRADE,
    CONTROLLING_OFFICER,
    LVL
) AS (
    -- Anchor
    SELECT 
        co.EMPNO,
        co.NAME,
        co.DESIG,
        co.DEPT,
        co.GRADE,
        co.CONTROLLING_OFFICER,
        1
    FROM MISC.M_EMPLOYEE_ALL co
    JOIN emp_base eb 
        ON co.EMPNO = eb.CONTROLLING_OFFICER
    WHERE co.RND_STATUS = :status
      AND co.IS_EMPLOYEE = :isEmployee

    UNION ALL

    -- Recursive
    SELECT 
        p.EMPNO,
        p.NAME,
        p.DESIG,
        p.DEPT,
        p.GRADE,
        p.CONTROLLING_OFFICER,
        h.LVL + 1
    FROM MISC.M_EMPLOYEE_ALL p
    JOIN hierarchy h 
        ON p.EMPNO = h.CONTROLLING_OFFICER
    WHERE p.RND_STATUS = :status
      AND p.IS_EMPLOYEE = :isEmployee
),

-- Filter only H & I once
hierarchy_filtered AS (
    SELECT EMPNO, NAME, DESIG, DEPT
    FROM hierarchy
    WHERE GRADE IN ('H','I')
)

-- Final result
SELECT
    approver.EMPNO AS "empNo",
    approver.NAME AS "name",
    approver.DESIG AS "designation",
    approver.DEPT AS "department"
FROM (
    SELECT EMPNO, NAME, DESIG, DEPT
    FROM hierarchy_filtered

    UNION   -- use UNION (not ALL) to auto-remove duplicates

    SELECT 
        e2.EMPNO,
        e2.NAME,
        e2.DESIG,
        e2.DEPT
    FROM MISC.M_VISITOR_GATEPASS_VEHICLE_HODS h
    JOIN emp_base eb 
        ON h.DEPT_CD = eb.DEPT_CD_UNIQUE
    JOIN MISC.M_EMPLOYEE_ALL e2 
        ON e2.EMPNO = h.HOD_EMP_ID
    WHERE e2.RND_STATUS = :status
      AND e2.IS_EMPLOYEE = :isEmployee
) approver
ORDER BY approver.NAME
    `;
  return sequelize_misc.query(sql, {
    replacements: {
      empno,
      status: "ACTIVE",
      isEmployee: 1,
    },
    type: QueryTypes.SELECT,
  });
}

export async function fetchVisitorRequests(empNo : string) {
  try {
    const visitors = await VisitorMultiple.findAll({
      where:{
        createdBy: empNo,
      },
  include: [
    {
      model: VisitorMultipleDetail,
      as: "details",
      required: true,
    },
    {
      model: Employee,
      as: "visitedEmployee",
      attributes: ["username", "name", "designation", "department"],
      required: false,
    },
  ],
  order: [["gpCreationDate", "DESC"]],

  
});

    return { rows: visitors.map((v) => v.get({ plain: true })), total: visitors.length };
  } catch (e: any) {
    console.error("Error fetching all visitors", e);
    return { rows: [], total: 0 };
  }
}
//use this function if you want to filter data in memory instead of database
// export async function fetchVisitorRequests({
//   search = "",
//   fromDate,
//   toDate,
//   page = 0,
//   pageSize = 10,
// }: {
//   search?: string;
//   fromDate?: string;
//   toDate?: string;
//   page?: number;
//   pageSize?: number;
// }) {
//   const where: any = {};

//   if (search.trim()) {
//     where[Op.or] = [
//       { companyName: { [Op.like]: `%${search}%` } },
//       { contact: { [Op.like]: `%${search}%` } },
//       { purpose: { [Op.like]: `%${search}%` } },
//     ];
//   }

//   if (fromDate || toDate) {
//     where.fromDate = {};

//     if (fromDate) where.fromDate[Op.gte] = new Date(fromDate);
//     if (toDate) where.fromDate[Op.lte] = new Date(toDate);
//   }

//   const result = await VisitorMultiple.findAndCountAll({
//     where,
//     include: [
//       {
//         model: VisitorMultipleDetail,
//         as: "details",
//         required: true,
//       },
//     ],
//     order: [["gpCreationDate", "DESC"]],
//     limit: pageSize,
//     offset: page * pageSize,
//   });

//   return {
//     rows: result.rows.map((row: any) => row.toJSON()),
//     total: result.count,
//   };
// }

function toDbDate(value: string | null) {
  if (!value) return null;
  return dayjs(value, "YYYY-MM-DD").startOf("day").toDate();
}

async function getNextVisitorId(transaction: any) {
  const result = await sequelize_misc.query<{ nextVid: number }>(
    `
    SELECT NVL(MAX(V_ID), 0) + 1 AS "nextVid"
    FROM MISC.VISITORMULTIPLE
    `,
    {
      type: QueryTypes.SELECT,
      transaction,
    },
  );

  return result[0].nextVid;
}

export async function createVisitorRequests(payload: any) {

  const transaction = await sequelize_misc.transaction();

  try {
    const { officerDetails, visitors } = payload;
  const autoApproved = officerDetails.autoApproved === true;
    if (!visitors?.length) {
      await transaction.rollback();

      return {
        success: false,
        message: "Add at least one visitor before submitting.",
        visitorIds: [],
      };
    }

    const firstVid = await getNextVisitorId(transaction);
    const visitorIds: number[] = [];

    for (let index = 0; index < visitors.length; index++) {
      const visitor = visitors[index];
      const vId = firstVid + index;

      visitorIds.push(vId);

      await VisitorMultiple.create(
        {
          vId,
          companyName: visitor.company,
          address1: visitor.address1,
          address2: visitor.address2,
          contact: Number(visitor.phone),
          purpose: officerDetails.purpose,
          vehicleNo: officerDetails.vehicleNo ?? null,
          employeeVisited: officerDetails.officerEmpno,
          empVisitedIcom: Number(officerDetails.intercom),
          fromDate: toDbDate(officerDetails.fromdate),
          toDate: toDbDate(officerDetails.todate),
          fromTime: officerDetails.fromtime,
          toTime: officerDetails.totime,
          createdBy:officerDetails.officerEmpno,
          approvingAuth: officerDetails.approvingAuthorityEmpNo ?? null,
          approvingStatus: officerDetails.approval_status
          ? GATEPASS_APPROVAL_STATUS.PENDING
          : GATEPASS_APPROVAL_STATUS.APPROVED,

          approvalDate: autoApproved ? new Date() : null,
          baggageStatus: visitor.laptopcarry === "Yes" ? 1 : 0,
          gpCreationDate: new Date(),
        },
        { transaction },
      );

      await VisitorMultipleDetail.create(
        {
          vId,
          title: visitor.title,
          name: visitor.name,
          age: Number(visitor.age),
          sex: visitor.gender,
          nationality: visitor.nationality,
        },
        { transaction },
      );
    }
await transaction.commit();

  if (!autoApproved) {
    try {
      await sendVisitorGatePassCreatedMail(visitorIds);
    } catch (mailError) {
      console.error("Visitor gate pass approval mail failed:", mailError);
    }
  }

   return {
      success: true,
      visitorIds,
      message: "Visitors submitted successfully.",
    };
  } catch (error: any) {
    await transaction.rollback();

    console.error("Visitor submit failed:", error);

    return {
      success: false,
      message: error?.message || "Visitor submit failed.",
      visitorIds: [],
    };
  }
}


// export async function isGatePassApprover(empNo: string, grade?: string) {
//   const approverGrades = ["D", "E", "F", "G", "H", "I"];

//   if (grade && approverGrades.includes(grade)) {
//     return true;
//   }

//   const rows = await sequelize_misc.query(
//     `
//     SELECT HOD_EMP_ID
//     FROM MISC.M_VISITOR_GATEPASS_HODS
//     WHERE HOD_EMP_ID = :empNo

//     UNION

//     SELECT HOD_EMP_ID
//     FROM MISC.M_VISITOR_GATEPASS_VEHICLE_HODS
//     WHERE HOD_EMP_ID = :empNo
//     `,
//     {
//       replacements: { empNo },
//       type: QueryTypes.SELECT,
//     },
//   );

//   return rows.length > 0;
// }
