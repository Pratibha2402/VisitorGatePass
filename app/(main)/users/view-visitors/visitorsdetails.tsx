"use client";

import VisibilityIcon from "@mui/icons-material/Visibility";

import { Button, DataGrid, GridColDef, TextField } from "@/app/core-components";

import type {
  GridFilterModel,
  GridRenderCellParams,
} from "@/app/core-components/DataGrid";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import GatePassStatusChip from "@/app/components/GatePassStatusChip";

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
        field: "status",
        headerName: "Status",
        width: 180,
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
            onClick={() =>
              router.push(`/users/view-visitors/${params.row.vId}`)
            }
            startIcon={<VisibilityIcon />}
          >
            View
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
    </div>
  );
}
