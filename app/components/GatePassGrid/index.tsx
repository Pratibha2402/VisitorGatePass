"use client";

import type { ReactNode } from "react";
import dayjs from "dayjs";
import { Button, Chip, DataGrid, GridColDef } from "@/app/core-components";
import GatePassStatusChip from "@/app/components/GatePassStatusChip";

export type GatePassGridAction = {
  label: string;
  icon?: ReactNode;
  color?: "primary" | "success" | "error" | "warning" | "info";
  variant?: "text" | "outlined" | "contained";
  show?: (row: any) => boolean;
  onClick: (row: any) => void | Promise<void>;
};

type GatePassGridProps = {
  rows: any[];
  actions?: GatePassGridAction[];
  showStatus?: boolean;
  checkboxSelection?: boolean;
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
  dataGridProps?: any;
};

export default function GatePassGrid({
  rows,
  actions = [],
  showStatus = true,
  checkboxSelection = false,
  selectedIds,
  onSelectionChange,
  dataGridProps,
}: GatePassGridProps) {
  const columns: GridColDef[] = [
    { field: "vId", headerName: "ID", width: 90 },
    {
      field: "visitorName",
      headerName: "Visitor",
      flex: 1,
      minWidth: 160,
      valueGetter: (_value: any, row: any) => row.details?.name ?? "",
    },
    { field: "companyName", headerName: "Company", flex: 1, minWidth: 160 },
    { field: "contact", headerName: "Contact", width: 140 },
    { field: "purpose", headerName: "Purpose", flex: 1, minWidth: 180 },
    {
      field: "visitFrom",
      headerName: "From",
      minWidth: 170,
      valueGetter: (_value: any, row: any) =>
        formatDateTime(row.fromDate, row.fromTime),
    },
    {
      field: "visitTo",
      headerName: "To",
      minWidth: 170,
      valueGetter: (_value: any, row: any) =>
        formatDateTime(row.toDate, row.toTime),
    },
    {
      field: "hostName",
      headerName: "Host",
      flex: 1,
      minWidth: 160,
      valueGetter: (_value: any, row: any) =>
        row.visitedEmployee?.name ?? row.createdBy ?? "-",
    },
    {
      field: "laptop",
      headerName: "Laptop",
      width: 110,
      renderCell: (params: any) => (
        <Chip
          size="small"
          label={params.row.baggageStatus === 1 ? "Yes" : "No"}
          color={params.row.baggageStatus === 1 ? "success" : "default"}
          variant="outlined"
        />
      ),
    },
    ...(showStatus
      ? [
          {
            field: "status",
            headerName: "Status",
            width: 180,
            renderCell: (params: any) => (
              <GatePassStatusChip row={params.row} />
            ),
          },
        ]
      : []),
    ...(actions.length
      ? [
          {
            field: "actions",
            headerName: "Actions",
            width: Math.max(160, actions.length * 115),
            sortable: false,
            filterable: false,
            renderCell: (params: any) => (
              <div className="flex gap-2">
                {actions
                  .filter((action) => !action.show || action.show(params.row))
                  .map((action) => (
                    <Button
                      key={action.label}
                      size="small"
                      color={action.color ?? "primary"}
                      variant={action.variant ?? "outlined"}
                      startIcon={action.icon}
                      onClick={() => action.onClick(params.row)}
                    >
                      {action.label}
                    </Button>
                  ))}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="w-full overflow-x-auto">
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.vId}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick
        rowSelectionModel={
          selectedIds
            ? {
                type: "include",
                ids: new Set(selectedIds),
              }
            : undefined
        }
        onRowSelectionModelChange={(model: any) => {
          if (!onSelectionChange) return;

          const ids =
            model?.ids instanceof Set
              ? Array.from(model.ids)
              : Array.isArray(model)
                ? model
                : [];

          onSelectionChange(ids.map(Number));
        }}
        pageSizeOptions={[5, 10, 20, 50]}
        {...dataGridProps}
      />
    </div>
  );
}

function formatDateTime(date: string | null, time?: string | null) {
  if (!date && !time) return "-";

  const formattedDate = date ? dayjs(date).format("DD-MMM-YYYY") : "";
  return [formattedDate, time].filter(Boolean).join(" ");
}
