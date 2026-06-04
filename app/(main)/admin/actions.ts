"use server";

import { revalidatePath } from "next/cache";
import { QueryTypes } from "sequelize";
import { sequelize_misc } from "@/app/database/db";
import { VisitorMultiple } from "@/app/database/models/Visitor_Master";
import { VisitorGatepassHods } from "@/app/database/models/VisitorGatePassHOD";
import { VisitorGatepassVehicleHods } from "@/app/database/models/VisitorGatePassVehicleHOD";
import { getSession } from "@/app/api/auth/get-session";
import { hasRole } from "@/app/api";
import { ADMIN_APPROVAL_STATUS, GATEPASS_APPROVAL_STATUS, USER_ROLES } from "@/app/enum";
import { sendAdminApprovedGatePassMail } from "@/app/mail/gatepass-security-notification";


async function assertAdmin() {
  const isAdmin = await hasRole([USER_ROLES.ADMIN]);

  if (!isAdmin) {
    throw new Error("You are not authorized for admin action.");
  }

  const session = await getSession();
  return String(session?.user?.empNo ?? session?.user?.username ?? "");
}

export async function adminApproveGatePass(vId: number) {
  await assertAdmin();

  const visitor = await VisitorMultiple.findOne({
    where: { vId },
  });

  if (!visitor) {
    return {
      success: false,
      message: "Gate pass not found.",
    };
  }

  await visitor.update({
    approvingStatus: GATEPASS_APPROVAL_STATUS.APPROVED,
    adminApprovalStatus: ADMIN_APPROVAL_STATUS.APPROVED_BY_ADMIN,
    approvalDate: new Date(),
  });

  await sendAdminApprovedGatePassMail([vId]);
  
  revalidatePath("/admin/approvals");
  revalidatePath("/admin/reports");

  return {
    success: true,
    message: "Gate pass approved by admin.",
  };
}

export async function adminRejectGatePass(vId: number) {
  await assertAdmin();

  const visitor = await VisitorMultiple.findOne({
    where: { vId },
  });

  if (!visitor) {
    return {
      success: false,
      message: "Gate pass not found.",
    };
  }

  await visitor.update({
    approvingStatus: GATEPASS_APPROVAL_STATUS.REJECTED,
    approvalDate: new Date(),
  });

  revalidatePath("/admin/approvals");
  revalidatePath("/admin/reports");

  return {
    success: true,
    message: "Gate pass rejected by admin.",
  };
}

async function getNextRowId(tableName: string) {
  const result = await sequelize_misc.query<{ nextRowId: number }>(
    `
    SELECT NVL(MAX(ROW_ID), 0) + 1 AS "nextRowId"
    FROM MISC.${tableName}
    `,
    {
      type: QueryTypes.SELECT,
    },
  );

  return result[0].nextRowId;
}

export async function addNormalGatePassApprover({
  empNo,
  deptCode,
}: {
  empNo: number;
  deptCode: string;
}) {
  const adminEmpNo = await assertAdmin();

  const existing = await VisitorGatepassHods.findOne({
    where: {
      hodEmpId: empNo,
      deptCode,
    },
  });

  if (existing) {
    return {
      success: false,
      message: "This employee is already a normal gate pass approver for this department.",
    };
  }

  const rowId = await getNextRowId("M_VISITOR_GATEPASS_HODS");

  await VisitorGatepassHods.create({
    rowId,
    hodEmpId: empNo,
    deptCode,
    updatedBy: adminEmpNo,
    updatedOn: new Date(),
  });

  revalidatePath("/admin/authorizations");

  return {
    success: true,
    message: "Normal gate pass approver added.",
  };
}

export async function addVehicleGatePassApprover({
  empNo,
  deptCode,
}: {
  empNo: number;
  deptCode: string;
}) {
  const adminEmpNo = await assertAdmin();

  const existing = await VisitorGatepassVehicleHods.findOne({
    where: {
      hodEmpId: empNo,
      deptCode,
    },
  });

  if (existing) {
    return {
      success: false,
      message: "This employee is already a vehicle gate pass approver for this department.",
    };
  }

  const rowId = await getNextRowId("M_VISITOR_GATEPASS_VEHICLE_HODS");

  await VisitorGatepassVehicleHods.create({
    rowId,
    hodEmpId: empNo,
    deptCode,
    updatedBy: adminEmpNo,
    updatedOn: new Date(),
  });

  revalidatePath("/admin/authorizations");

  return {
    success: true,
    message: "Vehicle gate pass approver added.",
  };
}

export async function deleteNormalGatePassApprover(rowId: number) {
  await assertAdmin();

  await VisitorGatepassHods.destroy({
    where: { rowId },
  });

  revalidatePath("/admin/authorizations");

  return {
    success: true,
    message: "Normal gate pass approver deleted.",
  };
}

export async function deleteVehicleGatePassApprover(rowId: number) {
  await assertAdmin();

  await VisitorGatepassVehicleHods.destroy({
    where: { rowId },
  });

  revalidatePath("/admin/authorizations");

  return {
    success: true,
    message: "Vehicle gate pass approver deleted.",
  };
}