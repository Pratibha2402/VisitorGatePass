import path from "path";
import dayjs from "dayjs";
import { Op } from "sequelize";
import { sendMailUsingTemplate } from ".";
import { APP_TITLE, RNDWORKFLOW_EMAIL, DG_SECURITY_EMAIL } from "@/app/constants";
import { VisitorMultiple } from "@/app/database/models/Visitor_Master";
import { VisitorMultipleDetail } from "@/app/database/models/VisitorMultipleDetails";
import { Employee } from "@/app/database/models/Employee";
import { VisitorsAdmin } from "@/app/database/models/Visitor_Admins";
import "@/app/database/models/associations";



function uniqueEmails(emails: Array<string | null | undefined>) {
  return [...new Set(emails.filter(Boolean).map((email) => email!.trim()))];
}




const adminRowsResult = await VisitorsAdmin.findAll({
  where: {
    status: 1,
  },
});

const adminRows = adminRowsResult.map((row: any) => row.toJSON());

const adminEmpNos = adminRows.map((admin: any) => admin.empNo);

const adminEmployeeRowsResult = await Employee.findAll({
  where: {
    empNo: {
      [Op.in]: adminEmpNos,
    },
  },
});

const adminEmployees = adminEmployeeRowsResult.map((row: any) => row.toJSON());

const adminEmailIds = adminEmployees
  .map((admin: any) => admin.emailId)
  .filter(Boolean);



async function getGatePassRows(visitorIds: number[]) {
  const rowsResult = await VisitorMultiple.findAll({
    where: {
      vId: {
        [Op.in]: visitorIds,
      },
    },
    include: [
      {
        model: VisitorMultipleDetail,
        as: "details",
        required: true,
      },
    ],
    order: [["vId", "ASC"]],
  });

  return rowsResult.map((row: any) => row.toJSON());
}

function buildVisitorRowsHtml(gatePassRows: any[]) {
  return gatePassRows
    .map(
      (row: any) => `
        <tr>
          <td>${row.vId}</td>
          <td>${row.details?.name || "-"}</td>
          <td>${row.contact || "-"}</td>
          <td>${row.companyName || "-"}</td>
        </tr>
      `,
    )
    .join("");
}

async function sendSecurityGatePassMail({
  visitorIds,
  subject,
  message,
  status,
  includeApproverInCc,
}: {
  visitorIds: number[];
  subject: string;
  message: string;
  status: string;
  includeApproverInCc: boolean;
}) {
  try {
    if (!visitorIds.length) return;

    const gatePassRows = await getGatePassRows(visitorIds);

    if (!gatePassRows.length) return;

    const first = gatePassRows[0];

  const approver =  (
      await Employee.findOne({
        where: { empNo: first.approvingAuth },
      })
    )?.toJSON();

  const initiator =  (
      await Employee.findOne({
        where: { username: first.createdBy },
      })
    )?.toJSON();

    const finalto = [DG_SECURITY_EMAIL];
    // TESTING ONLY
    const to = ["pratibhac@indianoil.in"];
    const cc: string[] = [];
    const finalcc = uniqueEmails([
      ...adminEmailIds,
      initiator?.emailId,
      includeApproverInCc ? approver?.emailId : null,
    ]).filter((email) => !to.includes(email));

    console.log("Final To:", finalto);
    console.log("Final CC:", finalcc);


    const visitorRowsHtml = buildVisitorRowsHtml(gatePassRows);

    await sendMailUsingTemplate(
      {
        from: RNDWORKFLOW_EMAIL,
        to,
        cc,
        subject,
      },
      {
        path: path.join(
          process.cwd(),
          "app",
          "mail",
          "templates",
          "gatepass-security-notification.html",
        ),
        context: {
          heading: APP_TITLE,
          message,
          visitorRows: visitorRowsHtml,
          purpose: first.purpose || "-",
          initiatorName: initiator?.name || "-",
          approverName: approver?.name || "-",
          visitDate: `${dayjs(first.fromDate).format("DD/MM/YYYY")} ${
            first.fromTime || ""
          }`,
          status,
        },
      },
    );
  } catch (error) {
    console.error("Security gate pass mail failed:", error);
    throw error;
  }
}

export async function sendAutoApprovedGatePassMail(visitorIds: number[]) {
  return sendSecurityGatePassMail({
    visitorIds,
    subject: `Visitor Gate Pass ${visitorIds.join(", ")} auto approved`,
    message:
      "A visitor gate pass has been created and auto approved. Details are mentioned below.",
    status: "Auto Approved",
    includeApproverInCc: false,
  });
}

export async function sendApproverApprovedGatePassMail(visitorIds: number[]) {
  return sendSecurityGatePassMail({
    visitorIds,
    subject: `Visitor Gate Pass ${visitorIds.join(", ")} approved by HOD`,
    message:
      "A visitor gate pass has been approved by the approver. Details are mentioned below.",
    status: "Approved by HOD",
    includeApproverInCc: true,
  });
}

export async function sendAdminApprovedGatePassMail(visitorIds: number[]) {
  return sendSecurityGatePassMail({
    visitorIds,
    subject: `Visitor Gate Pass ${visitorIds.join(", ")} approved by Admin`,
    message:
      "A visitor gate pass has been approved by admin. Details are mentioned below.",
    status: "Approved by Admin",
    includeApproverInCc: true,
  });
}