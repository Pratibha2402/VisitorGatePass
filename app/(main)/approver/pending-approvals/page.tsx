import { redirect } from "next/navigation";
import Page from "@/app/components/Page";
import { Paper } from "@/app/core-components";
import { PendingActions } from "@mui/icons-material";
import { getSession } from "@/app/api/auth/get-session";
import { fetchPendingGatePassApprovals } from "../api";
import ApprovalsTable from "./approvals-table";
import { hasRole } from "@/app/api";
import { USER_ROLES } from "@/app/enum";

export default async function PendingApprovalsPage() {
  const hasAccess = await hasRole([USER_ROLES.APPROVER]);

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
        className="flex w-full min-w-0 flex-col gap-6 overflow-hidden self-center p-8"
      >
        <ApprovalsTable rows={rows} mode="pending" />
      </Paper>
    </Page>
  );
}
