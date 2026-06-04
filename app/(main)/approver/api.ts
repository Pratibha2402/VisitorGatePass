"use server";

import { QueryTypes } from "sequelize";
import { sequelize_misc } from "@/app/database/db";
import { getSession } from "@/app/api/auth/get-session";
import { VisitorMultiple } from "@/app/database/models/Visitor_Master";
import { VisitorMultipleDetail } from "@/app/database/models/VisitorMultipleDetails";
import { Employee } from "@/app/database/models/Employee";
import "@/app/database/models/associations";
import { GATEPASS_APPROVAL_STATUS } from "@/app/enum";


const APPROVER_GRADES = ["D", "E", "F", "G", "H", "I"];

// export async function canAccessGatePassApprover() {
//   const session = await getSession();
//   const user = session?.user;

//   if (!user) return false;

//   const empNo = String(user.username ?? user.empNo ?? "");
//   const grade = String(user.grade ?? "");

//   if (APPROVER_GRADES.includes(grade)) {
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



export async function fetchPendingGatePassApprovals(empNo: string) {
  const rows = await VisitorMultiple.findAll({
    where: {
      approvingAuth: empNo,
      approvingStatus: GATEPASS_APPROVAL_STATUS.PENDING,
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
      {
        model: Employee,
        as: "approver",
        attributes: ["empNo", "name"],
        required: false,
      },
    ],
    order: [["gpCreationDate", "DESC"]],
  });

  return rows.map((row: any) => row.get({ plain: true }));
}

export async function fetchApprovedGatePassRequests(empNo: string) {
  const rows = await VisitorMultiple.findAll({
    where: {
      approvingAuth: empNo,
      approvingStatus: GATEPASS_APPROVAL_STATUS.APPROVED,
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
      {
        model: Employee,
        as: "approver",
        attributes: ["empNo", "name"],
        required: false,
      },
    ],
    order: [["approvalDate", "DESC"]],
  });

  return rows.map((row: any) => row.get({ plain: true }));
}

export async function fetchApproverGatePassById(vId: string) {
  const session = await getSession();
  const empNo = String(session?.user?.username ?? session?.user?.empNo ?? "");

  const row = await VisitorMultiple.findOne({
    where: {
      vId,
      approvingAuth: empNo,
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
  });

  return row ? row.get({ plain: true }) : null;
}