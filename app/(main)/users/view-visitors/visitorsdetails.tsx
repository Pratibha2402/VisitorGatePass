"use client";

import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  DataGrid,
  Dialog,
  DialogContent,
  DialogTitle,
  GridColDef,
  TextField,
  Typography,
} from "@/app/core-components";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import type { GridRenderCellParams } from "@mui/x-data-grid";

function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function VisitorDetails({
  initialRows,
  total,
}: {
  initialRows: any[];
  total: number;
}) {
  const [rows, setRows] = useState<any[]>(initialRows);
  const [rowCount, setRowCount] = useState(total);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectedVisitor, setSelectedVisitor] = useState<any | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [paginationModel, setPaginationModel] = useState({
    page: Number(searchParams.get("page") ?? 0),
    pageSize: Number(searchParams.get("pageSize") ?? 10),
  });
  //   useEffect(() => {
  //     async function loadVisitors() {
  //       setLoading(true);

  //       const params = new URLSearchParams({
  //         search: debouncedSearch,
  //         fromDate,
  //         toDate,
  //         page: String(paginationModel.page),
  //         pageSize: String(paginationModel.pageSize),
  //       });

  //       const response = await fetch(`/api/visitors?${params.toString()}`);
  //       const result = await response.json();

  //       setRows(result.rows ?? []);
  //       setRowCount(result.total ?? 0);
  //       setLoading(false);
  //     }

  //     loadVisitors();
  //   }, [debouncedSearch, fromDate, toDate, paginationModel]);

  useEffect(() => {
    setRows(initialRows);
    setRowCount(total);
  }, [initialRows, total]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("search", debouncedSearch);
      params.set("fromDate", fromDate);
      params.set("toDate", toDate);
      params.set("page", String(paginationModel.page));
      params.set("pageSize", String(paginationModel.pageSize));

      router.push(`?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [debouncedSearch, fromDate, toDate, paginationModel]);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "vId", headerName: "Visitor ID", width: 120 },
      {
        field: "visitorName",
        headerName: "Name",
        flex: 1,
        valueGetter: (_value: any, row: any) => row.details?.name ?? "",
      },

      { field: "companyName", headerName: "Company", flex: 1 },
      { field: "contact", headerName: "Contact No.", width: 150 },
      { field: "purpose", headerName: "Purpose", flex: 1 },

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
            onClick={() => setSelectedVisitor(params.row)}
            startIcon={<VisibilityIcon />}
          >
            Open
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <Box className="mx-auto my-20 max-w-10xl px-6">
      <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Visitor Requests
        </Typography>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TextField
            label="Search visitors"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPaginationModel((prev) => ({ ...prev, page: 0 }));
            }}
          />

          <TextField
            label="From Date"
            type="date"
            value={fromDate}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            onChange={(event) => {
              setFromDate(event.target.value);
              setPaginationModel((prev) => ({ ...prev, page: 0 }));
            }}
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
            onChange={(event) => {
              setToDate(event.target.value);
              setPaginationModel((prev) => ({ ...prev, page: 0 }));
            }}
          />
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200">
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.vId}
            loading={loading}
            rowCount={rowCount}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20, 50]}
            disableRowSelectionOnClick
          />
        </div>
      </div>

      <Dialog
        open={Boolean(selectedVisitor)}
        onClose={() => setSelectedVisitor(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Visitor Details</DialogTitle>
        <DialogContent dividers>
          {selectedVisitor && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Detail label="Visitor ID" value={selectedVisitor.vId} />
              <Detail label="Name" value={selectedVisitor.details?.name} />
              <Detail label="Company" value={selectedVisitor.companyName} />
              <Detail label="Contact" value={selectedVisitor.contact} />
              <Detail label="Purpose" value={selectedVisitor.purpose} />
              <Detail label="Address 1" value={selectedVisitor.address1} />
              <Detail label="Address 2" value={selectedVisitor.address2} />
              <Detail label="Age" value={selectedVisitor.details?.age} />
              <Detail label="Gender" value={selectedVisitor.details?.sex} />
              <Detail
                label="Nationality"
                value={selectedVisitor.details?.nationality}
              />
              <Detail
                label="Created By"
                value={selectedVisitor.visitedEmployee.name}
              />
              <Detail label="Intercom" value={selectedVisitor.empVisitedIcom} />
              <Detail
                label="From Date"
                value={formatDate(selectedVisitor.fromDate)}
              />
              <Detail
                label="To Date"
                value={formatDate(selectedVisitor.toDate)}
              />
              <Detail label="From Time" value={selectedVisitor.fromTime} />
              <Detail label="To Time" value={selectedVisitor.toTime} />
              <Detail
                label="Laptop Carry"
                value={selectedVisitor.baggageStatus === 1 ? "Yes" : "No"}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value || "-"}</Typography>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return dayjs(value).format("DD-MMM-YYYY");
}
