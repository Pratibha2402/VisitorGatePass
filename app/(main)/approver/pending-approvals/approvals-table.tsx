"use client";

import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button } from "@/app/core-components";
import { useRouter } from "next/navigation";
import GatePassGrid from "@/app/components/GatePassGrid";
import ApprovalGatePassDetailsDialog from "@/app/components/ApprovalGatePassDetailsDialog";
import {
  approveGatePass,
  approveGatePassMany,
  rejectGatePass,
} from "../actions";

export default function ApprovalsTable({
  rows,
  mode = "pending",
}: {
  rows: any[];
  mode?: "pending" | "approved";
}) {
  const router = useRouter();

  const [selectedVisitor, setSelectedVisitor] = useState<any | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const isPending = mode === "pending";

  return (
    <div className="flex w-full flex-col gap-4">
      {isPending && (
        <div className="flex justify-end gap-2">
          <Button
            color="success"
            variant="contained"
            disabled={selectedIds.length === 0}
            startIcon={<CheckCircleIcon />}
            onClick={async () => {
              const ok = window.confirm(
                `Approve ${selectedIds.length} selected gate pass(es)?`,
              );

              if (!ok) return;

              const result = await approveGatePassMany(selectedIds);

              if (!result.success) {
                alert(result.message);
                return;
              }

              setSelectedIds([]);
              router.refresh();
            }}
          >
            Approve Selected
          </Button>
        </div>
      )}

      <GatePassGrid
        rows={rows}
        checkboxSelection={isPending}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        actions={[
          {
            label: "View",
            icon: <VisibilityIcon />,
            onClick: (row) => setSelectedVisitor(row),
          },
          {
            label: "Approve",
            icon: <CheckCircleIcon />,
            color: "success",
            variant: "contained",
            show: () => isPending,
            onClick: async (row) => {
              const ok = window.confirm(`Approve gate pass #${row.vId}?`);
              if (!ok) return;

              const result = await approveGatePass(row.vId);

              if (!result.success) {
                alert(result.message);
                return;
              }

              router.refresh();
            },
          },
          {
            label: "Reject",
            icon: <CancelIcon />,
            color: "error",
            variant: "outlined",
            show: () => isPending,
            onClick: async (row) => {
              const ok = window.confirm(`Reject gate pass #${row.vId}?`);
              if (!ok) return;

              const result = await rejectGatePass(row.vId);

              if (!result.success) {
                alert(result.message);
                return;
              }

              router.refresh();
            },
          },
        ]}
      />

      <ApprovalGatePassDetailsDialog
        open={Boolean(selectedVisitor)}
        visitor={selectedVisitor}
        approving={approving}
        rejecting={rejecting}
        onClose={() => setSelectedVisitor(null)}
        onApprove={async (visitor) => {
          const ok = window.confirm(`Approve gate pass #${visitor.vId}?`);
          if (!ok) return;

          setApproving(true);
          const result = await approveGatePass(visitor.vId);
          setApproving(false);

          if (!result.success) {
            alert(result.message);
            return;
          }

          setSelectedVisitor(null);
          router.refresh();
        }}
        onReject={async (visitor) => {
          const ok = window.confirm(`Reject gate pass #${visitor.vId}?`);
          if (!ok) return;

          setRejecting(true);
          const result = await rejectGatePass(visitor.vId);
          setRejecting(false);

          if (!result.success) {
            alert(result.message);
            return;
          }

          setSelectedVisitor(null);
          router.refresh();
        }}
      />
    </div>
  );
}
