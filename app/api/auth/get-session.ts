"use server";
import { fetchEmployeebyUsername } from "@/app/api";
import { headers } from "next/headers";
import getCentralSession from "./central-session";
import { VisitorsAdmin } from "@/app/database/models/Visitor_Admins";
import { QueryTypes } from "sequelize";
import { sequelize_misc } from "@/app/database/db";
import { USER_ROLES } from "@/app/enum";


export async function getMainSession() {
  const headersList = await headers();
  const ipAddress =
    headersList.get("x-forwarded-for") ||
    headersList.get("socket.remoteAddress");
  const response = await getCentralSession({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ipAddress:
        process.env.NODE_ENV === "development"
          ? process.env.LOCALHOST_IP
          : ipAddress,
    }),
    cache: "no-store",
  });

  if (
    response.status === "SUCCESS" &&
    response.session?.status === "VALID" &&
    response.session?.username
  ) {
    const user = await fetchEmployeebyUsername(response.session.username);
    const session = { status: "VALID", user };

    return session;
  } else {
    return null;
  }
}

export async function getSession() {
  const session = await getMainSession();

  if (!session?.user) {
    return session;
  }

  const empNo = String(session.user.empNo ?? session.user.username ?? "");
  const grade = String(session.user.grade ?? "");

  // const dbRoles = JSON.parse(
  //   JSON.stringify(
  //     await VisitorsAdmin.findAll({
  //       where: {
  //         empNo,
  //         status: "1",
  //       },
  //     }),
  //   ),
  // ).map((role: any) => role.roleName);

  // const roles = new Set<string>(dbRoles);
  const adminRows = await VisitorsAdmin.findAll({
  where: {
    empNo: Number(empNo),
    status: 1,
  },
});

const roles = new Set<string>();

if (adminRows.length > 0) {
  roles.add(USER_ROLES.ADMIN);
}

  const canApprove = await isGatePassApprover(empNo, grade);
  const canApproveVehicle = await isVehicleGatePassApprover(empNo, grade);

  if (canApprove) {
    roles.add(USER_ROLES.APPROVER);
  }

  if (canApproveVehicle) {
    roles.add(USER_ROLES.VEHICLE_APPROVER);
  }

  return {
    ...session,
    user: {
      ...session.user,
      roles: Array.from(roles),
    },
  };
}
const NORMAL_APPROVER_GRADES = ["D", "E", "F", "G", "H", "I"];
const VEHICLE_APPROVER_GRADES = ["H", "I"];

async function isGatePassApprover(empNo: string, grade?: string) {
  if (grade && NORMAL_APPROVER_GRADES.includes(grade)) {
    return true;
  }

  const rows = await sequelize_misc.query(
    `
    SELECT HOD_EMP_ID
    FROM MISC.M_VISITOR_GATEPASS_HODS
    WHERE HOD_EMP_ID = :empNo

    UNION

    SELECT HOD_EMP_ID
    FROM MISC.M_VISITOR_GATEPASS_VEHICLE_HODS
    WHERE HOD_EMP_ID = :empNo
    `,
    {
      replacements: { empNo },
      type: QueryTypes.SELECT,
    },
  );

  return rows.length > 0;
}

async function isVehicleGatePassApprover(empNo: string, grade?: string) {
  if (grade && VEHICLE_APPROVER_GRADES.includes(grade)) {
    return true;
  }

  const rows = await sequelize_misc.query(
    `
    SELECT HOD_EMP_ID
    FROM MISC.M_VISITOR_GATEPASS_VEHICLE_HODS
    WHERE HOD_EMP_ID = :empNo
    `,
    {
      replacements: { empNo },
      type: QueryTypes.SELECT,
    },
  );

  return rows.length > 0;
}

