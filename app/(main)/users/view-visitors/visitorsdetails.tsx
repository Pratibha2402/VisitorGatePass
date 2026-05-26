"use client";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { Drawer, Box, IconButton } from "@/app/core-components";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  DataGrid,
  Dialog,
  DialogContent,
  DialogTitle,
  GridColDef,
  TextField,
  Typography,
  Stack,
  Divider,
  ListItem,
  ListItemText,
  List,
  DialogActions,
} from "@/app/core-components";
import Chip from "@mui/material/Chip";

import type {
  GridFilterModel,
  GridRenderCellParams,
} from "@/app/core-components/DataGrid";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

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

  // const [search, setSearch] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectedVisitor, setSelectedVisitor] = useState<any | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebounce(search);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
    quickFilterValues: search ? [search] : [],
  });
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
    <div className="flex w-full min-w-0 flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* <TextField
          label="Search visitors"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPaginationModel((prev) => ({ ...prev, page: 0 }));
          }}
        /> */}

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

      {/* <div className="w-full min-w-0 overflow-x-auto"> */}
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.vId}
        loading={loading}
        rowCount={rowCount}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        filterModel={filterModel}
        onFilterModelChange={(model) => {
          const quickSearch = model.quickFilterValues?.join(" ") ?? "";

          setFilterModel(model);
          setSearch(quickSearch);
          setPaginationModel((prev) => ({ ...prev, page: 0 }));
        }}
        pageSizeOptions={[5, 10, 20, 50]}
        disableRowSelectionOnClick
      />
      {/* </div> */}

      {/* <Dialog
        open={Boolean(selectedVisitor)}
        onClose={() => setSelectedVisitor(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Visitor Details</DialogTitle>
        <DialogContent dividers>
          {selectedVisitor && (
            <div>
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
      </Dialog> */}

      {/* <Dialog
        open={Boolean(selectedVisitor)}
        onClose={() => setSelectedVisitor(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Visitor Details</DialogTitle>

        <DialogContent dividers>
          {selectedVisitor && (
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
                <Stack spacing={2} flex={1}>
                  <Detail label="Visitor ID" value={selectedVisitor.vId} />
                  <Detail label="Name" value={selectedVisitor.details?.name} />
                  <Detail label="Company" value={selectedVisitor.companyName} />
                  <Detail label="Contact" value={selectedVisitor.contact} />
                  <Detail label="Purpose" value={selectedVisitor.purpose} />
                  <Detail label="Address 1" value={selectedVisitor.address1} />
                  <Detail label="Address 2" value={selectedVisitor.address2} />
                </Stack>

                <Stack spacing={2} flex={1}>
                  <Detail label="Age" value={selectedVisitor.details?.age} />
                  <Detail label="Gender" value={selectedVisitor.details?.sex} />
                  <Detail
                    label="Nationality"
                    value={selectedVisitor.details?.nationality}
                  />
                  <Detail
                    label="Created By"
                    value={selectedVisitor.visitedEmployee?.name}
                  />
                  <Detail
                    label="Intercom"
                    value={selectedVisitor.empVisitedIcom}
                  />
                  <Detail
                    label="Laptop Carry"
                    value={selectedVisitor.baggageStatus === 1 ? "Yes" : "No"}
                  />
                </Stack>
              </Stack>

              <Divider />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
                <Stack spacing={2} flex={1}>
                  <Detail
                    label="From Date"
                    value={formatDate(selectedVisitor.fromDate)}
                  />
                  <Detail label="From Time" value={selectedVisitor.fromTime} />
                </Stack>

                <Stack spacing={2} flex={1}>
                  <Detail
                    label="To Date"
                    value={formatDate(selectedVisitor.toDate)}
                  />
                  <Detail label="To Time" value={selectedVisitor.toTime} />
                </Stack>
              </Stack>
            </Stack>
          )}
        </DialogContent>
      </Dialog> */}
      {/* <Dialog
  open={Boolean(selectedVisitor)}
  onClose={() => setSelectedVisitor(null)}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle>Visitor Details</DialogTitle>

  <DialogContent dividers>
    {selectedVisitor && (
      <Stack spacing={3}>
        <DetailSection title="Visitor">
          <DetailRow label="Visitor ID" value={selectedVisitor.vId} />
          <DetailRow label="Name" value={selectedVisitor.details?.name} />
          <DetailRow label="Company" value={selectedVisitor.companyName} />
          <DetailRow label="Contact" value={selectedVisitor.contact} />
          <DetailRow label="Age" value={selectedVisitor.details?.age} />
          <DetailRow label="Gender" value={selectedVisitor.details?.sex} />
          <DetailRow
            label="Nationality"
            value={selectedVisitor.details?.nationality}
          />
        </DetailSection>

        <Divider />

        <DetailSection title="Visit">
          <DetailRow label="Purpose" value={selectedVisitor.purpose} />
          <DetailRow label="Address 1" value={selectedVisitor.address1} />
          <DetailRow label="Address 2" value={selectedVisitor.address2} />
          <DetailRow
            label="From"
            value={`${formatDate(selectedVisitor.fromDate)} ${selectedVisitor.fromTime || ""}`}
          />
          <DetailRow
            label="To"
            value={`${formatDate(selectedVisitor.toDate)} ${selectedVisitor.toTime || ""}`}
          />
          <DetailRow
            label="Laptop Carry"
            value={
              <Chip
                size="small"
                label={selectedVisitor.baggageStatus === 1 ? "Yes" : "No"}
                color={selectedVisitor.baggageStatus === 1 ? "success" : "default"}
                variant="outlined"
              />
            }
          />
        </DetailSection>

        <Divider />

        <DetailSection title="Host">
          <DetailRow
            label="Created By"
            value={selectedVisitor.visitedEmployee?.name}
          />
          <DetailRow label="Intercom" value={selectedVisitor.empVisitedIcom} />
        </DetailSection>
      </Stack>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setSelectedVisitor(null)}>Close</Button>
  </DialogActions>
</Dialog> */}

      <Dialog
        open={Boolean(selectedVisitor)}
        onClose={() => setSelectedVisitor(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Visitor Details</DialogTitle>

        <DialogContent dividers>
          {selectedVisitor && (
            <Stack spacing={3}>
              <DetailSection title="Visitor">
                <DetailRow label="Visitor ID" value={selectedVisitor.vId} />
                <DetailRow label="Name" value={selectedVisitor.details?.name} />
                <DetailRow
                  label="Company"
                  value={selectedVisitor.companyName}
                />
                <DetailRow label="Contact" value={selectedVisitor.contact} />
                <DetailRow label="Age" value={selectedVisitor.details?.age} />
                <DetailRow
                  label="Gender"
                  value={selectedVisitor.details?.sex}
                />
                <DetailRow
                  label="Nationality"
                  value={selectedVisitor.details?.nationality}
                />
              </DetailSection>

              <Divider />

              <DetailSection title="Visit">
                <DetailRow label="Purpose" value={selectedVisitor.purpose} />
                <DetailRow label="Address 1" value={selectedVisitor.address1} />
                <DetailRow label="Address 2" value={selectedVisitor.address2} />
                <DetailRow
                  label="From"
                  value={`${formatDate(selectedVisitor.fromDate)} ${selectedVisitor.fromTime || ""}`}
                />
                <DetailRow
                  label="To"
                  value={`${formatDate(selectedVisitor.toDate)} ${selectedVisitor.toTime || ""}`}
                />
                <DetailRow
                  label="Laptop Carry"
                  value={
                    <Chip
                      size="small"
                      label={selectedVisitor.baggageStatus === 1 ? "Yes" : "No"}
                      color={
                        selectedVisitor.baggageStatus === 1
                          ? "success"
                          : "default"
                      }
                      variant="outlined"
                    />
                  }
                />
              </DetailSection>

              <Divider />

              <DetailSection title="Host">
                <DetailRow
                  label="Created By"
                  value={selectedVisitor.visitedEmployee?.name}
                />
                <DetailRow
                  label="Intercom"
                  value={selectedVisitor.empVisitedIcom}
                />
              </DetailSection>
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setSelectedVisitor(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// function Detail({ label, value }: { label: string; value: any }) {
//   return (
//     <div>
//       <Typography variant="caption" color="text.secondary">
//         {label}
//       </Typography>
//       <Typography variant="body2">{value || "-"}</Typography>
//     </div>
//   );
// }

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" color="primary">
        {title}
      </Typography>

      <List dense disablePadding>
        {children}
      </List>
    </Stack>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <ListItem disableGutters sx={{ py: 0.5 }}>
      <ListItemText
        primary={label}
        secondary={value || "-"}
        slotProps={{
          primary: {
            variant: "caption",
            color: "text.secondary",
          },
          secondary: {
            variant: "body2",
            color: "text.primary",
          },
        }}
      />
    </ListItem>
  );
}
function Detail({ label, value }: { label: string; value: any }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value || "-"}</Typography>
    </Stack>
  );
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return dayjs(value).format("DD-MMM-YYYY");
}
