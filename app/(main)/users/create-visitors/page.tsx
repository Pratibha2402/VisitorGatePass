import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CreateVisitorForm from "./form";
import Page from "@/app/components/Page";
import {
  fetchAllActiveRndEmployees,
  fetchApprovingAuthority,
  fetchEmployeebyUsername,
  fetchapprovingAuthorityVehicle,
} from "@/app/database/data";
import { Paper } from "@/app/core-components";

export default async function CreateVisitorPage() {
  const loggedinUser = await fetchEmployeebyUsername("00066606");
  const approvingAuthority = await fetchApprovingAuthority("00066606");
  const approvingAuthorityVehicle =
    await fetchapprovingAuthorityVehicle("00066606");
  return (
    // <Page title="New Visitor" icon={PersonAddIcon}>

    <CreateVisitorForm
      loggedinUser={loggedinUser}
      approvingAuthority={approvingAuthority}
      approvingAuthorityVehicle={approvingAuthorityVehicle}
    />

    //</Page>
  );
}
