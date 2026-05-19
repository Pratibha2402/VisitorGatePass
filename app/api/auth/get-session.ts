"use server";
import { fetchEmployeebyUsername } from "@/app/api";
import { headers } from "next/headers";
import getCentralSession from "./central-session";
import { VisitorsAdmin } from "@/app/database/models/Visitor_Admins";

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
  // Remove this if your project does not have roles table
  if (session) {
    const userRoles = JSON.parse(
      JSON.stringify(
        await VisitorsAdmin.findAll({
          where: { empNo: session.user.username, status:'1' },
        })
      )
    )?.map((role: any) => role.roleName);
    return {
      ...session,
      user: { ...session.user, roles: [...userRoles] },
    };
  }
  return session;
}
