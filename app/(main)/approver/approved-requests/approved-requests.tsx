"use client";

import { useMemo, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Button, DataGrid, GridColDef, TextField } from "@/app/core-components";
import type { GridRenderCellParams } from "@/app/core-components/DataGrid";
import GatePassStatusChip from "@/app/components/GatePassStatusChip";
import UserGatePassDetailsDialog from "@/app/components/UserGatePassDetailsDialog";
import dayjs from "dayjs";

export default function ApprovedRequests({ rows }: { rows: any[] }) {
  const [selectedVisitor, setSelectedVisitor] = useState<any | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "vId",
        headerName: "Visitor ID",
        flex: 1,
        minWidth: 100,
      },
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

  const filteredRows = useMemo(() => {
    const searchFrom = fromDate ? dayjs(fromDate).startOf("day") : null;
    const searchTo = toDate ? dayjs(toDate).endOf("day") : null;

    return rows.filter((row) => {
      const visitorFromDate = row.fromDate ? dayjs(row.fromDate) : null;
      const visitorToDate = row.toDate ? dayjs(row.toDate) : null;

      return (
        (!searchFrom ||
          visitorToDate?.isAfter(searchFrom) ||
          visitorToDate?.isSame(searchFrom, "day")) &&
        (!searchTo ||
          visitorFromDate?.isBefore(searchTo) ||
          visitorFromDate?.isSame(searchTo, "day"))
      );
    });
  }, [rows, fromDate, toDate]);

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          onChange={(event) => setFromDate(event.target.value)}
        />

        <TextField
          label="To Date"
          type="date"
          value={toDate}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          onChange={(event) => setToDate(event.target.value)}
        />
      </div>

      <DataGrid
        rows={filteredRows}
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
