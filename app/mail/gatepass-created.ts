import path from "path";
import dayjs from "dayjs";
import { Op, QueryTypes } from "sequelize";
import { sendMailUsingTemplate } from ".";
import { sequelize_misc } from "@/app/database/db";
import { APP_TITLE, RNDWORKFLOW_EMAIL } from "@/app/constants";
import { GATEPASS_APPROVAL_STATUS } from "@/app/enum";
import { Employee } from "../database/models/Employee";
import { VisitorMultiple } from "../database/models/Visitor_Master";
import { VisitorMultipleDetail } from "../database/models/VisitorMultipleDetails";
import { VisitorsAdmin } from "../database/models/Visitor_Admins";
import { toast } from "sonner";

type GatePassMailRow = {
  gatePassId: number;
  visitorName: string;
  visitorMobile: string | null;
  visitorCompany: string | null;
  purpose: string | null;
  fromDate: Date | null;
  toDate: Date | null;
  fromTime: string | null;
  toTime: string | null;
  approverName: string | null;
  approverEmail: string | null;
  initiatorName: string | null;
  initiatorEmail: string | null;
};

type EmailRow = {
  email: string | null;
};

function uniqueEmails(emails: Array<string | null | undefined>) {
  return [...new Set(emails.filter(Boolean).map((email) => email!.trim()))];
}

export async function sendVisitorGatePassCreatedMail(visitorIds: number[]) {

  try
  {
  if (!visitorIds.length) return;

const gatePassRowsResult = await VisitorMultiple.findAll({
  where: {
    vId: {
      [Op.in]: visitorIds,
    },
    approvingStatus: GATEPASS_APPROVAL_STATUS.PENDING,
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

const gatePassRows = gatePassRowsResult.map((row: any) => row.toJSON());

if (!gatePassRows.length) return;

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

  const approver =  (
      await Employee.findOne({
        where: { empNo: gatePassRows[0].approvingAuth },
      })
    )?.toJSON();

  const initiator =  (
      await Employee.findOne({
        where: { username: gatePassRows[0].createdBy },
      })
    )?.toJSON();



  const finalto = approver?.emailId ? [approver.emailId] : [];
  const cc = uniqueEmails([
    ...adminEmailIds,
    initiator?.emailId,
  ]).filter((email) => !finalto.includes(email));

// TESTING ONLY
const to = ["pratibhac@indianoil.in"];
//const cc: string[] = [];

console.log("Final To:", finalto);
console.log("Final CC:", cc);

  if (!to.length) {
    throw new Error("Approver email not found for visitor gate pass.");
  }

  const first = gatePassRows[0];

  const visitorRowsHtml = gatePassRows
    .map(
      (row) => `
        <tr>
          <td>${row.vId}</td>
          <td>${row.details?.name || "-"}</td>
          <td>${row.contact  || "-"}</td>
          <td>${row.companyName  || "-"}</td>
        </tr>
      `,
    )
    .join("");



   await sendMailUsingTemplate(
    {
      from: RNDWORKFLOW_EMAIL,
      to,
      cc,
      subject: `Visitor Gate Pass ${visitorIds.join(", ")} requires approval`,
    },
    {
      path: path.join(
        process.cwd(),
        "app",
        "mail",
        "templates",
        "gatepass-created.html"
      ),
      context: {
        heading: APP_TITLE,
        salutation: "Sir/Madam",
        visitorRows: visitorRowsHtml,
        purpose: first.purpose || "-",
        hostName: initiator.name || "-",
        visitDate: `${dayjs(first.fromDate).format("DD/MM/YYYY")} ${first.fromTime || ""}`,
        status: "Pending Approval",
      },
    }
  );
}


catch (error) {
  console.error("Error sending visitor gate pass created mail:", error);
  toast.error("Failed to send gate pass approval email. Please contact support.");
  throw error;  
}
}