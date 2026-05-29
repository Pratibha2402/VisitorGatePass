import { redirect } from "next/navigation";
import Page from "@/app/components/Page";
import { Paper } from "@/app/core-components";
import { PendingActions } from "@mui/icons-material";
import { hasRole } from "@/app/api";
import { USER_ROLES } from "@/app/enum";
import { fetchAllPendingGatePassesForAdmin } from "../api";
import AdminApprovalsTable from "./admin-approvals-table";

export default async function AdminGatePassApprovalsPage() {
  const isAdmin = await hasRole([USER_ROLES.ADMIN]);

  if (!isAdmin) {
    redirect("/users/view-visitors");
  }

  const rows = await fetchAllPendingGatePassesForAdmin();

  return (
    <Page title="Admin Gate Pass Approvals" icon={PendingActions}>
      <Paper
        elevation={4}
        className="flex w-full min-w-0 flex-col gap-6 overflow-hidden self-center p-8"
      >
        <AdminApprovalsTable rows={rows} />
      </Paper>
    </Page>
  );
}
