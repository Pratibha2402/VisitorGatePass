import VisitorDetails from "./visitorsdetails";
import { VisitorRequests } from "./api";

export default async function ViewVisitorsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    fromDate?: string;
    toDate?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const params = await searchParams;

  const data = await VisitorRequests({
    search: params.search ?? "",
    fromDate: params.fromDate ?? "",
    toDate: params.toDate ?? "",
    page: Number(params.page ?? 0),
    pageSize: Number(params.pageSize ?? 10),
  });

  return <VisitorDetails initialRows={data.rows} total={data.total} />;
}
