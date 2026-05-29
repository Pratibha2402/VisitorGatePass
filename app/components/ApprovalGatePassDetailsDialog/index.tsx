// app/components/ApprovalGatePassDetailsDialog/index.tsx

"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@/app/core-components";
import GatePassDetailsContent from "@/app/components/GatePassDetailsContent";

export default function ApprovalGatePassDetailsDialog({
  open,
  visitor,
  onClose,
  onApprove,
  onReject,
  approving = false,
  rejecting = false,
}: {
  open: boolean;
  visitor: any | null;
  onClose: () => void;
  onApprove: (visitor: any) => Promise<void>;
  onReject: (visitor: any) => Promise<void>;
  approving?: boolean;
  rejecting?: boolean;
}) {
  if (!visitor) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Pending Gate Pass Details</DialogTitle>

      <DialogContent dividers>
        <GatePassDetailsContent visitor={visitor} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>

        <Button
          color="error"
          variant="outlined"
          loading={rejecting}
          onClick={() => onReject(visitor)}
        >
          Reject
        </Button>

        <Button
          color="success"
          variant="contained"
          loading={approving}
          onClick={() => onApprove(visitor)}
        >
          Approve
        </Button>
      </DialogActions>
    </Dialog>
  );
}
