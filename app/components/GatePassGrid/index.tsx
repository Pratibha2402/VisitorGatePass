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
    {
      field: "vId",
      headerName: "ID",
      width: 75,
    },
    {
      field: "visitorName",
      headerName: "Visitor",
      flex: 1,
      minWidth: 170,
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
      minWidth: 150,
    },
    {
      field: "companyName",
      headerName: "Company",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "address1",
      headerName: "Address",
      flex: 1.4,
      minWidth: 150,
    },
    ...(actions.length
      ? [
          {
            field: "actions",
            headerName: "Actions",
            width: 330,
            sortable: false,
            filterable: false,
            renderCell: (params: any) => (
              <div className="flex flex-wrap gap-1">
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
    <div className="w-full min-w-0">
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

          if (model?.ids instanceof Set) {
            const ids = Array.from(model.ids).map(Number);

            if (model.type === "exclude") {
              const excluded = new Set(ids);
              onSelectionChange(
                rows
                  .map((row) => Number(row.vId))
                  .filter((id) => !excluded.has(id)),
              );
              return;
            }

            onSelectionChange(ids);
            return;
          }

          if (Array.isArray(model)) {
            onSelectionChange(model.map(Number));
            return;
          }

          onSelectionChange([]);
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
