import Chip from "@mui/material/Chip";
import { ADMIN_APPROVAL_STATUS, GATEPASS_APPROVAL_STATUS } from "@/app/enum";

type GatePassStatusChipProps = {
  row?: any;
  approvingStatus?: number | null;
  adminApprovalStatus?: number | null;
  size?: "small" | "medium";
  variant?: "filled" | "outlined";
};

export type GatePassStatusColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

export type GatePassStatusView = {
  label: string;
  color: GatePassStatusColor;
};

function getGatePassStatus(row: {
  approvingStatus?: number | null;
  adminApprovalStatus?: number | null;
}): GatePassStatusView {
  if (
    row.approvingStatus === GATEPASS_APPROVAL_STATUS.APPROVED &&
    row.adminApprovalStatus === ADMIN_APPROVAL_STATUS.APPROVED_BY_ADMIN
  ) {
    return {
      label: "Approved by Admin",
      color: "secondary",
    };
  }

  if (row.approvingStatus === GATEPASS_APPROVAL_STATUS.APPROVED) {
    return {
      label: "Approved",
      color: "success",
    };
  }

  if (row.approvingStatus === GATEPASS_APPROVAL_STATUS.REJECTED) {
    return {
      label: "Rejected",
      color: "error",
    };
  }

  return {
    label: "Pending",
    color: "warning",
  };
}

export default function GatePassStatusChip({
  row,
  approvingStatus,
  adminApprovalStatus,
  size = "small",
  variant = "outlined",
}: GatePassStatusChipProps) {
  const status = getGatePassStatus(
    row ?? {
      approvingStatus,
      adminApprovalStatus,
    },
  );

  return (
    <Chip
      size={size}
      label={status.label}
      color={status.color}
      variant={variant}
    />
  );
}
