import { redirect } from "next/navigation";
import Page from "@/app/components/Page";
import { Paper } from "@/app/core-components";
import { NoteAdd } from "@mui/icons-material";
import { getSession } from "@/app/api/auth/get-session";
import {
  canAccessGatePassApprover,
  fetchApprovedGatePassRequests,
} from "../api";
import ApprovalsTable from "../pending-approvals/approvals-table";

export default async function ApprovedRequestsPage() {
  const hasAccess = await canAccessGatePassApprover();

  if (!hasAccess) {
    redirect("/users/view-visitors");
  }

  const session = await getSession();
  const empNo = String(session?.user?.username ?? session?.user?.empNo ?? "");

  const rows = await fetchApprovedGatePassRequests(empNo);

  return (
    <Page title="Approved Gate Pass Requests" icon={NoteAdd}>
      <Paper
        elevation={4}
        className="flex w-full flex-col gap-6 self-center p-8"
      >
        <ApprovalsTable rows={rows} mode="approved" />
      </Paper>
    </Page>
  );
}
