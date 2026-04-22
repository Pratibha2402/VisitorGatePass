import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CreateVisitorForm from "./form";
import Page from "@/app/components/Page";
import {
  fetchAllActiveRndEmployees,
  fetchApprovingAuthority,
  fetchEmployeebyUsername,
} from "@/app/database/data";

export default async function CreateVisitorPage() {
  const loggedinUser = await fetchEmployeebyUsername("00511173");
  const approvingAuthority = await fetchApprovingAuthority("00511173");
  const allActiveRndEmployees = await fetchAllActiveRndEmployees();
  return (
    <Page title="New Visitor" icon={PersonAddIcon}>
      <div className="mx-auto w-full max-w-[1120px] rounded-2xl bg-white p-4 shadow-lg sm:p-6 md:p-8">
        <CreateVisitorForm
          loggedinUser={loggedinUser}
          approvingAuthority={approvingAuthority}
          allActiveRndEmployees={allActiveRndEmployees}
        />
      </div>
    </Page>
    //   </Stack>
    // </Box>
  );
}
