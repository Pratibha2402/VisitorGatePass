"use client";

import type { ReactNode } from "react";
import dayjs from "dayjs";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@/app/core-components";
import Stack from "@mui/material/Stack";
import GatePassStatusChip from "@/app/components/GatePassStatusChip";
import { Employee } from "@/app/database/models/Employee";

export default function GatePassDetailsDialog({
  open,
  visitor,
  onClose,
  //   onApprove,
  //   approving = false,
  title = "Gate Pass Details",
  actions,
}: {
  open: boolean;
  visitor: any | null;
  onClose: () => void;
  //   onApprove?: (vId: number) => Promise<void>;
  //   approving?: boolean;
  title?: string;
  actions?: ReactNode;
}) {
  if (!visitor) return null;
  const approver = Employee.findOne({
    where: { empId: visitor.approvingAuth },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span>{title}</span>
          <GatePassStatusChip row={visitor} />
        </div>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {visitor.details?.name || "Visitor"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {visitor.companyName || "-"} | Visitor #{visitor.vId}
            </Typography>
          </Stack>

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
            <InfoItem
              label="Nationality"
              value={visitor.details?.nationality}
            />
            <InfoItem
              label="Laptop Carry"
              value={visitor.baggageStatus === 1 ? "Yes" : "No"}
            />
          </InfoSection>

          <Divider />

          <InfoSection title="Officer Visited">
            <InfoItem
              label="Created By"
              value={visitor.visitedEmployee?.name}
            />
            <InfoItem label="Intercom" value={visitor.empVisitedIcom} />
            <InfoItem
              label="Approving Authority"
              value={visitor.approverAuth}
            />
          </InfoSection>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {actions}
        {/* {onApprove && (
          <Button
            color="success"
            variant="contained"
            loading={approving}
            onClick={() => onApprove(visitor.vId)}
          >
            Approve
          </Button>
        )} */}
      </DialogActions>
    </Dialog>
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
