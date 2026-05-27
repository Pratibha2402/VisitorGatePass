import { notFound, redirect } from "next/navigation";
import Page from "@/app/components/Page";
import { Person } from "@mui/icons-material";
import VisitorInfoView from "@/app/(main)/users/view-visitors/visitor-info-view";
import {
  canAccessGatePassApprover,
  fetchApproverGatePassById,
} from "../../api";

export default async function ApprovedRequestDetailsPage({
  params,
}: {
  params: Promise<{ vId: string }>;
}) {
  const hasAccess = await canAccessGatePassApprover();

  if (!hasAccess) {
    redirect("/users/view-visitors");
  }

  const { vId } = await params;
  const visitor = await fetchApproverGatePassById(vId);

  if (!visitor) {
    notFound();
  }

  return (
    <Page title="Approved Gate Pass Details" icon={Person}>
      <VisitorInfoView
        visitor={visitor}
        backHref="/approver/approved-requests"
      />
    </Page>
  );
}
