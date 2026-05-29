import { redirect } from "next/navigation";
import Page from "@/app/components/Page";
import { Paper } from "@/app/core-components";
import { Assessment } from "@mui/icons-material";
import { hasRole } from "@/app/api";
import { USER_ROLES } from "@/app/enum";
import { fetchAllGatePassReports } from "../api";
import ApprovedRequestsClient from "@/app/(main)/approver/approved-requests/approved-requests";

export default async function AdminGatePassReportsPage() {
  const isAdmin = await hasRole([USER_ROLES.ADMIN]);

  if (!isAdmin) {
    redirect("/users/view-visitors");
  }

  const rows = await fetchAllGatePassReports();

  return (
    <Page title="Gate Pass Reports" icon={Assessment}>
      <Paper
        elevation={4}
        className="flex w-full min-w-0 flex-col gap-6 overflow-hidden self-center p-8"
      >
        <ApprovedRequestsClient rows={rows} />
      </Paper>
    </Page>
  );
}
