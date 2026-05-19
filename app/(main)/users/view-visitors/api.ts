"use server";
import dayjs from "dayjs";
import { VisitorMultiple } from "@/app/database/models/Visitor_Master";
import { VisitorMultipleDetail } from "@/app/database/models/VisitorMultipleDetails";
import { fetchVisitorRequests } from "../api";
import { getSession } from "@/app/api/auth/get-session";
export async function VisitorRequests({
  search = "",
  fromDate = "",
  toDate = "",
  page = 0,
  pageSize = 10,
}) {

  const session = await getSession();
  const { user } = session || {};
  const empNo = user?.empNo || ""; 
  console.log("Empno in api is for getting records:",empNo);// or session.user.username, depending on your API
const result = await fetchVisitorRequests(empNo);
const visitors = result.rows;


 // const plainVisitors = visitors.map((visitor: any) => visitor.toJSON());

  const searchText = search.trim().toLowerCase();

  const filteredVisitors = visitors.filter((visitor: any) => {
    const visitorFromDate = visitor.fromDate ? dayjs(visitor.fromDate) : null;
    const visitorToDate = visitor.toDate ? dayjs(visitor.toDate) : null;

    const matchesSearch =
      !searchText ||
      String(visitor.vId ?? "").toLowerCase().includes(searchText) ||
      String(visitor.details?.name ?? "").toLowerCase().includes(searchText) ||
      String(visitor.companyName ?? "").toLowerCase().includes(searchText) ||
      String(visitor.contact ?? "").toLowerCase().includes(searchText) ||
      String(visitor.purpose ?? "").toLowerCase().includes(searchText);

      const searchFrom = fromDate ? dayjs(fromDate).startOf("day") : null;
      const searchTo = toDate ? dayjs(toDate).endOf("day") : null;

const matchesDateRange =
  (!searchFrom ||
    visitorToDate?.isAfter(searchFrom) ||
    visitorToDate?.isSame(searchFrom, "day")) &&
  (!searchTo ||
    visitorFromDate?.isBefore(searchTo) ||
    visitorFromDate?.isSame(searchTo, "day"));

  //   const matchesFromDate =
  //     !fromDate ||
  //     (visitorFromDate && (visitorFromDate.isAfter(dayjs(fromDate), "day") || visitorFromDate.isSame(dayjs(fromDate), "day")));

  //   const matchesToDate =
  //     !toDate ||
  //     (visitorToDate && (visitorToDate.isBefore(dayjs(toDate), "day") || visitorToDate.isSame(dayjs(toDate), "day")));

  //   return matchesSearch && matchesFromDate && matchesToDate;
  // });

     return matchesSearch && matchesDateRange;
  });

  const start = page * pageSize;
  const paginatedVisitors = filteredVisitors.slice(start, start + pageSize);

  return {
    rows: paginatedVisitors,
    total: filteredVisitors.length,
  };
}

