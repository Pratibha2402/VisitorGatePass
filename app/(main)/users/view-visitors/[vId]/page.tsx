import { notFound } from "next/navigation";
import Page from "@/app/components/Page";
import { Person } from "@mui/icons-material";
import { VisitorRequestById } from "../api";
import VisitorInfoView from "../visitor-info-view";

export default async function VisitorDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ vId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { vId } = await params;
  const query = await searchParams;

  const visitor = await VisitorRequestById(vId);

  if (!visitor) {
    notFound();
  }

  const backHref = buildBackHref(query);

  return (
    <Page title="Visitor Details" icon={Person}>
      <VisitorInfoView visitor={visitor} backHref={backHref} />
    </Page>
  );
}

function buildBackHref(query: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (typeof value === "string" && value) {
      params.set(key, value);
    }
  });

  const queryString = params.toString();

  return queryString
    ? `/users/view-visitors?${queryString}`
    : "/users/view-visitors";
}
