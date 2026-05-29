import path from "path";
import dayjs from "dayjs";
import { QueryTypes } from "sequelize";
import { sendMailUsingTemplate } from ".";
import { sequelize_misc } from "@/app/database/db";
import { APP_TITLE, RNDWORKFLOW_EMAIL } from "@/app/constants";
import { GATEPASS_APPROVAL_STATUS } from "@/app/enum";

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
  if (!visitorIds.length) return;

  const gatePassRows = await sequelize_misc.query<GatePassMailRow>(
    `
    SELECT
      vm.V_ID AS "gatePassId",
      vd.V_NAME AS "visitorName",
      vm.V_CONTACT AS "visitorMobile",
      vm.V_COMPNAME AS "visitorCompany",
      vm.V_PURPOSE AS "purpose",
      vm.V_FROM AS "fromDate",
      vm.V_TO AS "toDate",
      vm.V_FROMTIME AS "fromTime",
      vm.V_TOTIME AS "toTime",
      approver.NAME AS "approverName",
      approver.EMAILID AS "approverEmail",
      initiator.NAME AS "initiatorName",
      initiator.EMAILID AS "initiatorEmail"
    FROM MISC.VISITORMULTIPLE vm
    JOIN MISC.VISITORMULTIPLEDETAIL vd
      ON vd.V_ID = vm.V_ID
    LEFT JOIN MISC.M_EMPLOYEE_ALL approver
      ON approver.EMPNO = vm.APPROVING_AUTH
    LEFT JOIN MISC.M_EMPLOYEE_ALL initiator
      ON initiator.EMPNO = vm.V_CREATEDBY
    WHERE vm.V_ID IN (:visitorIds)
      AND vm.APPROVING_STATUS = :pendingStatus
    `,
    {
      replacements: {
        visitorIds,
        pendingStatus: GATEPASS_APPROVAL_STATUS.PENDING,
      },
      type: QueryTypes.SELECT,
    }
  );

  if (!gatePassRows.length) return;

  const adminRows = await sequelize_misc.query<EmailRow>(
    `
    SELECT emp.EMAILID AS "email"
    FROM MISC.VISITOR_ADMINS admin
    JOIN MISC.M_EMPLOYEE_ALL emp
      ON emp.EMPNO = admin.EMPNO
    WHERE admin.STATUS = 1
      AND emp.EMAILID IS NOT NULL
    `,
    {
      type: QueryTypes.SELECT,
    }
  );

  const finalto = uniqueEmails(gatePassRows.map((row) => row.approverEmail));
  const finalcc = uniqueEmails([
    ...adminRows.map((row) => row.email),
    ...gatePassRows.map((row) => row.initiatorEmail),
  ]).filter((email) => !finalto.includes(email));

// TESTING ONLY
const to = ["pratibhac@indianoil.in"];
const cc: string[] = [];

console.log("Final To:", finalto);
console.log("Final CC:", finalcc);

  if (!to.length) {
    throw new Error("Approver email not found for visitor gate pass.");
  }

  const first = gatePassRows[0];

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
        salutation: first.approverName || "Sir/Madam",
        gatePassId: visitorIds.join(", "),
        visitorName: gatePassRows.map((row) => row.visitorName).join(", "),
        visitorMobile: first.visitorMobile || "-",
        visitorCompany: first.visitorCompany || "-",
        purpose: first.purpose || "-",
        hostName: first.initiatorName || "-",
        visitDate: `${dayjs(first.fromDate).format("DD/MM/YYYY")} ${first.fromTime || ""}`,
        status: "Pending Approval",
      },
    }
  );
}