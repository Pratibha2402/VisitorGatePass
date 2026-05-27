import { redirect } from "next/navigation";
import Page from "@/app/components/Page";
import { Paper } from "@/app/core-components";
import { PendingActions } from "@mui/icons-material";
import { getSession } from "@/app/api/auth/get-session";
import {
  canAccessGatePassApprover,
  fetchPendingGatePassApprovals,
} from "../api";
import ApprovalsTable from "./approvals-table";

export default async function PendingApprovalsPage() {
  const hasAccess = await canAccessGatePassApprover();

  if (!hasAccess) {
    redirect("/users/view-visitors");
  }

  const session = await getSession();
  const empNo = String(session?.user?.username ?? session?.user?.empNo ?? "");

  const rows = await fetchPendingGatePassApprovals(empNo);

  return (
    <Page title="Pending Gate Pass Approvals" icon={PendingActions}>
      <Paper
        elevation={4}
        className="flex w-full flex-col gap-6 self-center p-8"
      >
        <ApprovalsTable rows={rows} mode="pending" />
      </Paper>
    </Page>
  );
}
