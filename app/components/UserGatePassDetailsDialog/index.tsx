// app/components/UserGatePassDetailsDialog/index.tsx

"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@/app/core-components";
import GatePassDetailsContent from "@/app/components/GatePassDetailsContent";

export default function UserGatePassDetailsDialog({
  open,
  visitor,
  onClose,
}: {
  open: boolean;
  visitor: any | null;
  onClose: () => void;
}) {
  if (!visitor) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Visitor Details</DialogTitle>

      <DialogContent dividers>
        <GatePassDetailsContent visitor={visitor} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
      {/* <DialogActions>
        <Button onClick={onClose}>Create Similar Gate Pass</Button>
      </DialogActions> */}
    </Dialog>
  );
}
