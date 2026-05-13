import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CreateVisitorForm from "./form";
import { fetchApprovingAuthority, fetchapprovingAuthorityVehicle } from "./api";

import { fetchEmployeebyUsername } from "@/app/api";

export const metadata = {
  title: "Create Visitor",
  description: "Create a new visitor entry",
};

export default async function CreateVisitorPage() {
  const loggedinUser = await fetchEmployeebyUsername("00066606");
  const approvingAuthority = await fetchApprovingAuthority("00066606");
  const approvingAuthorityVehicle =
    await fetchapprovingAuthorityVehicle("00066606");
  return (
    <CreateVisitorForm
      loggedinUser={loggedinUser}
      approvingAuthority={approvingAuthority}
      approvingAuthorityVehicle={approvingAuthorityVehicle}
    />
  );
}
