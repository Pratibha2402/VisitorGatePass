"use server";

import { createVisitorRequests } from "./api";

export async function submitVisitorRequests(payload: any) {
  return createVisitorRequests(payload);
}
