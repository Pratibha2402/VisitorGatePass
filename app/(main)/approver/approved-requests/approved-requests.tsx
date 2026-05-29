"use client";

import { useMemo, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button, DataGrid, GridColDef } from "@/app/core-components";
import type { GridRenderCellParams } from "@/app/core-components/DataGrid";
import GatePassStatusChip from "@/app/components/GatePassStatusChip";
import UserGatePassDetailsDialog from "@/app/components/UserGatePassDetailsDialog";

export default function ApprovedRequests({ rows }: { rows: any[] }) {
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
      {
        field: "contact",
        headerName: "Mobile",
        width: 130,
      },
      {
        field: "purpose",
        headerName: "Purpose",
        flex: 1,
        minWidth: 140,
      },
      {
        field: "companyName",
        headerName: "Company",
        flex: 1,
        minWidth: 140,
      },
      {
        field: "address1",
        headerName: "Address",
        flex: 1.2,
        minWidth: 160,
      },
      {
        field: "status",
        headerName: "Status",
        width: 170,
        renderCell: (params: any) => <GatePassStatusChip row={params.row} />,
      },
      {
        field: "actions",
        headerName: "Details",
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams) => (
          <Button
            size="small"
            variant="contained"
            startIcon={<VisibilityIcon />}
            onClick={() => setSelectedVisitor(params.row)}
          >
            View
          </Button>
        ),
      },
    ],
    [],
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
