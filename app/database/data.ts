import * as oracledb from "oracledb";
import { getConnection } from "./db";

type BindParams = Record<string, string | number>;

type Employee = {
  EMPNO: number;
  NAME: string;
  DESIG: string;
  DEPT: string;
  EMAILID: string;
  MOBILE: number;
  USERNAME: string;
};

type ApprovingAuthority = {
  EMPNO: number;
  NAME: string;
  DESIG: string;
  DEPT: string;
};

async function executeQuery<T>(
  sql: string,
  bindParams: BindParams = {}
): Promise<T[]> {
  const connection = await getConnection();

  try {
    const result = await connection.execute<T>(sql, bindParams, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    return result.rows ?? [];
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

export async function fetchAllActiveRndEmployees() {
  try {
    const sql = `
      SELECT EMPNO, NAME, DESIG, DEPT, EMAILID, MOBILE, USERNAME 
      FROM MISC.M_EMPLOYEE_ALL
      WHERE RND_STATUS = :status
        AND IS_EMPLOYEE = :isEmployee
    `;

    return await executeQuery<Employee>(sql, {
      status: "ACTIVE",
      isEmployee: 1,
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch employees' data.");
  }
}

export async function fetchApprovingAuthority(empno: string) {
  try {
    const sql = `
      WITH emp_dept AS (
        SELECT DEPT_CD
        FROM MISC.M_EMPLOYEE
        WHERE EMPNO = :empno
      )
      SELECT DISTINCT
        approver.EMPNO,
        approver.NAME,
        approver.DESIG,
        approver.DEPT
      FROM (
        SELECT
          e.EMPNO,
          e.NAME,
          e.DESIG,
          e.DEPT
        FROM MISC.M_EMPLOYEE_ALL e
        JOIN emp_dept d ON e.DEPT_CD = d.DEPT_CD
        WHERE e.GRADE IN ('D', 'E', 'F', 'G', 'H', 'I')
          AND e.DOJ IS NOT NULL
          AND e.RND_STATUS = :status
          AND e.IS_EMPLOYEE = :isEmployee

        UNION

        SELECT
          e2.EMPNO,
          e2.NAME,
          e2.DESIG,
          e2.DEPT
        FROM MISC.M_VISITOR_GATEPASS_HODS h
        JOIN emp_dept d ON h.DEPT_CD = d.DEPT_CD
        JOIN MISC.M_EMPLOYEE_ALL e2 ON e2.EMPNO = h.HOD_EMP_ID
        WHERE e2.RND_STATUS = :status
          AND e2.IS_EMPLOYEE = :isEmployee
      ) approver
      ORDER BY approver.NAME
    `;

    return await executeQuery<ApprovingAuthority>(sql, {
      empno,
      status: "ACTIVE",
      isEmployee: 1,
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch employees' data.");
  }
}



export async function fetchEmployeebyUsername(username: string) {
  try {
    const sql = `
      SELECT EMPNO, NAME, DESIG, DEPT, EMAILID, MOBILE, USERNAME 
      FROM MISC.M_EMPLOYEE_ALL
      WHERE username = :username and RND_STATUS = :status
        AND IS_EMPLOYEE = :isEmployee
    
    `;

    const employees = await executeQuery<Employee>(sql, {
      username: username,
      status: "ACTIVE",
      isEmployee: 1,
    });

    return employees[0] ?? null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch employees' data.");
  }
}

export type { ApprovingAuthority, Employee };
