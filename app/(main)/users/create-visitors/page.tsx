import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CreateVisitorForm from "./form";
import {
  fetchApprovingAuthority,
  fetchapprovingAuthorityVehicle,
} from "../api";

// import { fetchEmployeebyUsername } from "@/app/api";
import { redirect } from "next/navigation";
import { getSession } from "@/app/api/auth/get-session";
import { env } from "process";

export const metadata = {
  title: "Create Visitor",
  description: "Create a new visitor entry",
};

export default async function CreateVisitorPage() {
  const session = await getSession();
  console.log("SESSION INVALID IN page.tsx:", session);
  if (!session?.user) {
    redirect(env.CENTRAL_SIGNIN_URL as string);
  }

  const empNo = session.user.username; // or session.user.username, depending on your API
  const loggedinUser = session.user; // await fetchEmployeebyUsername(empNo);
  const approvingAuthority = await fetchApprovingAuthority(empNo);
  console.log("approvingAuthority", approvingAuthority);
  const approvingAuthorityVehicle = await fetchapprovingAuthorityVehicle(empNo);
  console.log("approvingAuthorityVehicle", approvingAuthorityVehicle);
  return (
    <CreateVisitorForm
      loggedinUser={loggedinUser}
      approvingAuthority={approvingAuthority}
      approvingAuthorityVehicle={approvingAuthorityVehicle}
    />
  );
}
