import { redirect } from "next/navigation";
import Page from "@/app/components/Page";
import { Paper } from "@/app/core-components";
import { AdminPanelSettings } from "@mui/icons-material";
import { hasRole } from "@/app/api";
import { USER_ROLES } from "@/app/enum";
import {
  fetchAllDepartments,
  fetchAllEmployees,
  fetchNormalApproverAuthorizations,
  fetchVehicleApproverAuthorizations,
} from "../api";
import AuthorizationForm from "./authorization-form";

export default async function GatePassAuthorizationsPage() {
  const isAdmin = await hasRole([USER_ROLES.ADMIN]);

  if (!isAdmin) {
    redirect("/users/view-visitors");
  }

  const departments = await fetchAllDepartments();
  const normalRows = await fetchNormalApproverAuthorizations();
  const vehicleRows = await fetchVehicleApproverAuthorizations();
  const employees = await fetchAllEmployees();
  return (
    <Page title="Gate Pass Approver Authorization" icon={AdminPanelSettings}>
      <Paper
        elevation={4}
        className="flex w-full max-w-6xl flex-col gap-8 self-center p-8"
      >
        <AuthorizationForm
          departments={departments}
          normalRows={normalRows}
          vehicleRows={vehicleRows}
          employees={employees}
        />
      </Paper>
    </Page>
  );
}
