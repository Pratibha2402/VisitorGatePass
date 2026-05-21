import Page from "@/app/components/Page";
import CreateVisitorForm from "./form";
import {
  fetchApprovingAuthority,
  fetchapprovingAuthorityVehicle,
} from "../api";
import { AddShoppingCart, Print, PersonAdd } from "@mui/icons-material";
// import { fetchEmployeebyUsername } from "@/app/api";
import { redirect } from "next/navigation";
import { getSession } from "@/app/api/auth/get-session";
import { env } from "process";
import { Paper } from "@/app/core-components";

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
    <Page title="Create a New Visitor" icon={PersonAdd}>
      {/* <Paper className="flex w-8/12 min-w-64 flex-col gap-4 self-center p-8"> */}
      <Paper
        elevation={4}
        className="flex w-full max-w-6xl flex-col gap-4 self-center p-8"
      >
        <CreateVisitorForm
          loggedinUser={loggedinUser}
          approvingAuthority={approvingAuthority}
          approvingAuthorityVehicle={approvingAuthorityVehicle}
        />
      </Paper>
    </Page>
  );
}
