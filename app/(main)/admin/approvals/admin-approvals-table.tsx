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

export default function AdminApprovalsTable({ rows }: { rows: any[] }) {
  const router = useRouter();
  const [selectedVisitor, setSelectedVisitor] = useState<any | null>(null);

  const columns: GridColDef[] = useMemo(
    () => [
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
                const result = await adminApproveGatePass(params.row.vId);

                if (!result.success) {
                  alert(result.message);
                  return;
                }

                router.refresh();
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
                const result = await adminRejectGatePass(params.row.vId);

                if (!result.success) {
                  alert(result.message);
                  return;
                }

                router.refresh();
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
