"use server";

import { VisitorMultiple } from "@/app/database/models/Visitor_Master";
import { getSession } from "@/app/api/auth/get-session";
import { GATEPASS_APPROVAL_STATUS, USER_ROLES } from "@/app/enum";
import { revalidatePath } from "next/cache";
import { Op } from "sequelize";
import { hasRole } from "@/app/api";

export async function approveGatePass(vId: number) {
  const hasAccess = await hasRole([USER_ROLES.APPROVER]);

  if (!hasAccess) {
    return {
      success: false,
      message: "You are not authorized to approve gate passes.",
    };
  }

  const session = await getSession();
  const empNo = String(session?.user?.username ?? session?.user?.empNo ?? "");

  const visitor = await VisitorMultiple.findOne({
    where: {
      vId,
      approvingAuth: empNo,
    },
  });

  if (!visitor) {
    return {
      success: false,
      message: "Gate pass not found for your approval.",
    };
  }

  await visitor.update({
    approvingStatus: GATEPASS_APPROVAL_STATUS.APPROVED,
    approvalDate: new Date(),
  });

revalidatePath("/approver/pending-approvals");
revalidatePath("/approver/approved-requests");

  return {
    success: true,
    message: "Gate pass approved successfully.",
  };
}

export async function rejectGatePass(vId: number) {
  const hasAccess = await hasRole([USER_ROLES.APPROVER]);

  if (!hasAccess) {
    return {
      success: false,
      message: "You are not authorized to reject gate passes.",
    };
  }

  const session = await getSession();
  const empNo = String(session?.user?.username ?? session?.user?.empNo ?? "");

  const visitor = await VisitorMultiple.findOne({
    where: {
      vId,
      approvingAuth: empNo,
    },
  });

  if (!visitor) {
    return {
      success: false,
      message: "Gate pass not found for your approval.",
    };
  }

  await visitor.update({
    approvingStatus: GATEPASS_APPROVAL_STATUS.REJECTED,
    approvalDate: new Date(),
  });

  revalidatePath("/approver/pending-approvals");
  revalidatePath("/approver/approved-requests");

  return {
    success: true,
    message: "Gate pass rejected successfully.",
  };
} 

export async function approveGatePassMany(vIds: number[]) {
  const hasAccess = await hasRole([USER_ROLES.APPROVER]);

  if (!hasAccess) {
    return {
      success: false,
      message: "You are not authorized to approve gate passes.",
    };
  }

  if (!vIds.length) {
    return {
      success: false,
      message: "Select at least one gate pass to approve.",
    };
  }

  const session = await getSession();
  const empNo = String(session?.user?.username ?? session?.user?.empNo ?? "");

  await VisitorMultiple.update(
    {
      approvingStatus: GATEPASS_APPROVAL_STATUS.APPROVED,
      approvalDate: new Date(),
    },
    {
      where: {
        vId: vIds,
        approvingAuth: empNo,
        approvingStatus: {
          [Op.or]: [null, GATEPASS_APPROVAL_STATUS.PENDING],
        },
      },
    },
  );

  revalidatePath("/approver/pending-approvals");
  revalidatePath("/approver/approved-requests");

  return {
    success: true,
    message: "Selected gate passes approved successfully.",
  };
}
