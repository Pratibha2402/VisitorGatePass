"use client";

import { useMemo, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button, DataGrid, GridColDef } from "@/app/core-components";
import UserGatePassDetailsDialog from "@/app/components/UserGatePassDetailsDialog";
import GatePassStatusChip from "@/app/components/GatePassStatusChip";
import { adminApproveGatePass, adminRejectGatePass } from "../actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminApprovalsTable({ rows }: { rows: any[] }) {
  const router = useRouter();
  const [selectedVisitor, setSelectedVisitor] = useState<any | null>(null);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "vId", headerName: "Visitor ID", width: 100 },
      {
        field: "visitorName",
        headerName: "Visitor",
        flex: 1,
        minWidth: 160,
        valueGetter: (_value: any, row: any) =>
          [row.details?.title, row.details?.name].filter(Boolean).join(" "),
      },
      { field: "contact", headerName: "Mobile", width: 130 },
      { field: "purpose", headerName: "Purpose", flex: 1, minWidth: 140 },
      { field: "companyName", headerName: "Company", flex: 1, minWidth: 140 },
      { field: "address1", headerName: "Address", flex: 1.2, minWidth: 160 },
      {
        field: "status",
        headerName: "Status",
        width: 170,
        renderCell: (params: any) => <GatePassStatusChip row={params.row} />,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 330,
        sortable: false,
        filterable: false,
        renderCell: (params: any) => (
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Button
              size="small"
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => setSelectedVisitor(params.row)}
            >
              View
            </Button>

            <Button
              size="small"
              color="success"
              variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={async () => {
                try {
                  const result = await adminApproveGatePass(params.row.vId);
                  if (!result.success) {
                    alert(result.message);
                    toast.error("Failed to approve the gate pass.");
                    return;
                  }
                  toast.success("Gate pass approved successfully.");
                } catch (err) {
                  alert("An error occurred while approving the gate pass.");
                  toast.error(
                    "An error occurred while approving the gate pass.",
                  );
                  return;
                } finally {
                  router.refresh();
                }
              }}
            >
              Approve
            </Button>

            <Button
              size="small"
              color="error"
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={async () => {
                try {
                  const result = await adminRejectGatePass(params.row.vId);

                  if (!result.success) {
                    toast.error("Failed to reject the gate pass.");
                    return;
                  }
                  toast.success("Gate pass rejected successfully.");
                } catch (err) {
                  toast.error(
                    "An error occurred while rejecting the gate pass.",
                  );
                } finally {
                  router.refresh();
                }
              }}
            >
              Reject
            </Button>
          </div>
        ),
      },
    ],
    [router],
  );

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.vId}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 20, 50]}
      />

      <UserGatePassDetailsDialog
        open={Boolean(selectedVisitor)}
        visitor={selectedVisitor}
        onClose={() => setSelectedVisitor(null)}
      />
    </div>
  );
}
