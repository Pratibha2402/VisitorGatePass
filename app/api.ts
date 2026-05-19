"use server";

import {Employee} from "@/app/database/models/Employee";
import { getSession } from "@/app/api/auth/get-session";

export async function fetchEmployeebyUsername(username: string) {
  try {
    let employee = await Employee.findOne({
      where: {
        username,
      },
    });

    if (!employee) {
      throw new Error("Employee not found in rnd database!!");
    }

    const jsonEmployee = JSON.parse(JSON.stringify(employee));

    const emp = {
      ...jsonEmployee,
    };
    return emp;
  } catch (e: any) {
    console.error(e?.message || "Something went wrong!");
  }
}

export async function hasRole(rolesToCheck: Array<string>) {
  const session = await getSession();
  if (!("roles" in session?.user)) {
    console.error("Invalid session.");
    return false;
  }
  if (rolesToCheck.some((role: string) => session?.user?.roles?.includes(role)))
    return true;
  return false;
}