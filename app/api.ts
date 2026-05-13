"use server";

import {Employee} from "@/app/database/models/Employee";

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