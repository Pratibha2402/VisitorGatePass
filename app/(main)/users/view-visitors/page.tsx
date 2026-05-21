import VisitorDetails from "./visitorsdetails";
import { VisitorRequests } from "./api";
import { Paper } from "@/app/core-components";
import Page from "@/app/components/Page";
import { PersonAdd } from "@mui/icons-material";

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

  return (
    <Page title="Pending Approvals" icon={PersonAdd}>
      <Paper
        elevation={4}
        className="flex w-full flex-col gap-8 self-center p-8"
      >
        <VisitorDetails initialRows={data.rows} total={data.total} />
      </Paper>
    </Page>
  );
}
