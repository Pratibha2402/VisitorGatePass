import type { ReactNode } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import {
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@/app/core-components";
import GatePassStatusChip from "@/app/components/GatePassStatusChip";

export default function VisitorInfoView({
  visitor,
  backHref,
  actions,
}: {
  visitor: any;
  backHref: string;
  actions?: ReactNode;
}) {
  return (
    <Paper
      elevation={4}
      className="flex w-full max-w-6xl flex-col gap-6 self-center p-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Stack spacing={0.5}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {visitor.details?.name || "Visitor"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {visitor.companyName || "-"} | Visitor #{visitor.vId}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Chip
            size="small"
            label={
              visitor.baggageStatus === 1 ? "Laptop Carrying" : "No Laptop"
            }
            color={visitor.baggageStatus === 1 ? "success" : "default"}
            variant="outlined"
          />
          <GatePassStatusChip
            approvingStatus={visitor.approvingStatus}
            adminApprovalStatus={visitor.adminApprovalStatus}
          />

          {actions}

          {/* <Link href={backHref} style={{ textDecoration: "none" }}>
            <Button variant="outlined">Back</Button>
          </Link> */}
        </Stack>
      </div>

      <Divider />

      <InfoSection title="Visit Information">
        <InfoItem label="Purpose" value={visitor.purpose} />
        <InfoItem
          label="From"
          value={formatDateTime(visitor.fromDate, visitor.fromTime)}
        />
        <InfoItem
          label="To"
          value={formatDateTime(visitor.toDate, visitor.toTime)}
        />
        <InfoItem label="Address Line 1" value={visitor.address1} />
        <InfoItem label="Address Line 2" value={visitor.address2} />
      </InfoSection>

      <Divider />

      <InfoSection title="Visitor Information">
        <InfoItem label="Visitor ID" value={visitor.vId} />
        <InfoItem label="Name" value={visitor.details?.name} />
        <InfoItem label="Company" value={visitor.companyName} />
        <InfoItem label="Contact Number" value={visitor.contact} />
        <InfoItem label="Age" value={visitor.details?.age} />
        <InfoItem label="Gender" value={visitor.details?.sex} />
        <InfoItem label="Nationality" value={visitor.details?.nationality} />
      </InfoSection>

      <Divider />

      <InfoSection title="Officer Information">
        <InfoItem label="Created By" value={visitor.visitedEmployee?.name} />
        <InfoItem label="Intercom" value={visitor.empVisitedIcom} />
      </InfoSection>
    </Paper>
  );
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
        {title}
      </Typography>

      <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
        {children}
      </div>
    </Stack>
  );
}

function InfoItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {value || "-"}
      </Typography>
    </Stack>
  );
}

function formatDateTime(date: string | null, time?: string | null) {
  if (!date && !time) return "-";

  const formattedDate = date ? dayjs(date).format("DD-MMM-YYYY") : "";
  return [formattedDate, time].filter(Boolean).join(" ");
}
