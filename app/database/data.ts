// import * as oracledb from "oracledb";
// import { getConnection } from "./db";
import { QueryTypes } from "sequelize";
import { sequelize_misc } from "./db";
import { Employee } from "./models/Employee";

type ApprovingAuthority = {
  empNo: number;
  name: string;
  designation: string;
  department: string;
};

type VehicleApprovingAuthority = {
  empNo: number;
  name: string;
  designation: string;
  department: string;
};


export async function fetchEmployeebyUsername(username: string) {
  try {
    let employee = await Employee.findOne({
      where: {
        username,
      },
    });

    if (!employee) {
      throw new Error("Employee not found in rnd database!!");
    }

    const jsonEmployee = JSON.parse(JSON.stringify(employee));

    const emp = {
      ...jsonEmployee,
    };
    return emp;
  } catch (e: any) {
    console.error(e?.message || "Something went wrong!");
  }
}

export async function fetchApprovingAuthority(empno: string) {
  const sql = `
WITH emp_dept AS (
  SELECT DEPT_CD
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
  JOIN emp_dept d ON e.DEPT_CD = d.DEPT_CD
  WHERE e.GRADE IN ('D', 'E', 'F', 'G', 'H', 'I')
    AND e.DOJ IS NOT NULL
    AND e.RND_STATUS = :status
    AND e.IS_EMPLOYEE = :isEmployee

  UNION

  SELECT e2.EMPNO, e2.NAME, e2.DESIG, e2.DEPT
  FROM M_VISITOR_GATEPASS_HODS h
  JOIN emp_dept d ON h.DEPT_CD = d.DEPT_CD
  JOIN M_EMPLOYEE_ALL e2 ON e2.EMPNO = h.HOD_EMP_ID
  WHERE e2.RND_STATUS = :status
    AND e2.IS_EMPLOYEE = :isEmployee
) approver
ORDER BY approver.NAME
  `;

  return sequelize_misc.query<ApprovingAuthority>(sql, {
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
        DEPT_CD,
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
        ON h.DEPT_CD = eb.DEPT_CD
    JOIN MISC.M_EMPLOYEE_ALL e2 
        ON e2.EMPNO = h.HOD_EMP_ID
    WHERE e2.RND_STATUS = :status
      AND e2.IS_EMPLOYEE = :isEmployee
) approver
ORDER BY approver.NAME
    `;
  return sequelize_misc.query<VehicleApprovingAuthority>(sql, {
    replacements: {
      empno,
      status: "ACTIVE",
      isEmployee: 1,
    },
    type: QueryTypes.SELECT,
  });
}

export type { ApprovingAuthority,VehicleApprovingAuthority };
export {Employee};
