import { QueryTypes } from "sequelize";
import { sequelize_misc } from "@/app/database/db";
import { VisitorMultiple } from "@/app/database/models/Visitor_Master";
import { VisitorMultipleDetail } from "@/app/database/models/VisitorMultipleDetails";
import dayjs from "dayjs";
export const runtime = "nodejs";


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

export async function POST(request: Request) {
  const body = await request.json();
  const transaction = await sequelize_misc.transaction();

  try {
    const { officerDetails, visitors } = body;

    if (!visitors || visitors.length === 0) {
      await transaction.rollback();

      return Response.json(
        { success: false, message: "No visitors found." },
        { status: 400 },
      );
    }

    const firstVid = await getNextVisitorId(transaction);
    const generatedIds: number[] = [];

    for (let index = 0; index < visitors.length; index++) {
      const visitor = visitors[index];
      const vId = firstVid + index;

      generatedIds.push(vId);

      await VisitorMultiple.create(
        {
          vId,
          companyName: visitor.company,
          address1: visitor.address1,
          address2: visitor.address2,
          contact: Number(visitor.phone),

          purpose: officerDetails.purpose,
          employeeVisited: officerDetails.officerName,
          empVisitedIcom: Number(officerDetails.intercom),

        fromDate: toDbDate(officerDetails.fromdate),
        toDate: toDbDate(officerDetails.todate),
          fromTime: officerDetails.fromtime,
          toTime: officerDetails.totime,

          approvingAuth: officerDetails.approvingAuthority?.empNo ?? null,
          approvingStatus: 0,
          baggageStatus: visitor.laptopcarry === "Yes" ? 1 : 0,
          adminApprovalStatus: 0,

          createdBy: officerDetails.officerName,
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

          country: null,
          passportNo: null,
          passportValidity: null,
          visaNo: null,
          visaValidity: null,
        },
        { transaction },
      );
    }

    await transaction.commit();

    return Response.json({
      success: true,
      visitorIds: generatedIds,
      message: "Visitors submitted successfully.",
    });
  } catch (error: any) {
    await transaction.rollback();

    console.error("Visitor submit failed:", error);

    return Response.json(
      {
        success: false,
        message: error?.message || "Visitor submit failed.",
      },
      { status: 500 },
    );
  }
}
